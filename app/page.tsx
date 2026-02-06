{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"],
      "#imports": ["./.nuxt/imports"]
    }
  }
}
