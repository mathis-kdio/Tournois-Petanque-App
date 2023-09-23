import { config as defaultConfig, createConfig } from "@gluestack-ui/themed"

export const config = createConfig({
  ...defaultConfig.theme,
  aliases: {
    ...defaultConfig.theme.aliases,
    jc: "justifyContent",
  },
  components: {
    CheckboxIndicator: {
      theme: {
        borderColor: '$white',
        ':checked': {
          borderColor: '$white',
          ':pressed': {
            borderColor: '$white',
          },
        },
        ':pressed': {
          borderColor: '$white',
        },
      },
    },
    Input: {
      theme: {
        borderColor: '$white',
        ':focus': {
          borderColor: '$white',
        },
      },
    },
    SelectTrigger: {
      theme: {
        borderColor: '$white',
      },
    },
    RadioIndicator: {
      theme: {
        borderColor: '$white',
        ':checked': {
          borderColor: '$white',
        },
        ':active': {
          borderColor: '$white',
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