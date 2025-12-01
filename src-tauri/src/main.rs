#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri_plugin_updater::UpdaterExt;

pub fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_updater::Builder::new().build())
    .setup(|app| {
      let handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        update(handle).await.unwrap();
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

async fn update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {
  if let Some(update) = app.updater()?.check().await? {
    let mut downloaded = 0;

    // alternatively we could also call update.download() and update.install() separately
    update
      .download_and_install(
        |chunk_length, content_length| {
          downloaded += chunk_length;
          println!("downloaded {downloaded} from {content_length:?}");
        },
        || {
          println!("download finished");
        },
      )
      .await?;

    println!("update installed");
    app.restart();
  }

  Ok(())
}
