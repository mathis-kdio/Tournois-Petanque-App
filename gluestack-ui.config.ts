import { config as defaultConfig, createConfig } from "@gluestack-ui/themed"

export const config = createConfig({
  ...defaultConfig.theme,
  aliases: {
    ...defaultConfig.theme.aliases,
    jc: "justifyContent",
  },
  components: {
    Checkbox: {
      theme: {
        _text: {
          color:"white"
        },
        bg: "cyan.600",
        borderColor: "white",
        _checked: {
          borderColor: "white",
          bg: "cyan.600",
          _pressed: {
            borderColor: "white",
            bg: "cyan.600"
          }
        },
        _pressed:{
          borderColor: "white"
        }
      },
      sizes: {
        md: { _text: { fontSize: 'md' } }
      },
    },
    Input: {
      theme: {
        color: "white",
        borderColor: "white",
        _focus: {
          borderColor: "white"
        }
      }
    },
    Select: {
      theme: {
        _customDropdownIconProps: {
          color: "white"
        },
      },
    },
  },
})

// Get the type of Config
type ConfigType = typeof config

// Extend the internal ui config
declare module "@gluestack-ui/themed" {
  interface UIConfig extends ConfigType {}
}