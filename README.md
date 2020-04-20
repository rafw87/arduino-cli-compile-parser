# Arduino CLI compilation result parser

This action parses compilation result from Arduino CLI and extracts program and ram memory usage.

## Inputs

### `compile-log`
**Required** Log from `arduino-cli compile`
### `progmem-bytes-treshold`
Treshold for program memory bytes. Its exceeding will be indicated by `progmem-bytes-excedded='1'`

### `progmem-percentage-treshold`
Treshold for program memory percentage. Its exceeding will be indicated by `progmem-percentage-excedded='1'`

### `ram-bytes-treshold`
Treshold for RAM bytes. Its exceeding will be indicated by `ram-bytes-excedded='1'`

### `ram-percentage-treshold`
Treshold for RAM percentage. Its exceeding will be indicated by `ram-percentage-excedded='1'`

### `ram-remained-treshold`
Treshold for remained RAM. Its exceeding (going below) will be indicated by `ram-remained-excedded='1'`


## Outputs

### `progmem-bytes`
Number of program memory bytes as reported by arduino-cli.

### `progmem-bytes-exceeded`
Value '1' indicates that progmem-bytes-treshold has been exceeded.

### `progmem-percentage`
Percentage of program memory used as reported by arduino-cli.

### `progmem-percentage-exceeded`
Value '1' indicates that progmem-percentage-treshold has been exceeded.

### `progmem-total`
Total program memory used as reported by arduino-cli.

### `ram-bytes`
Number of dynamic memory bytes as reported by arduino-cli.

### `ram-bytes-exceeded`
Value '1' indicates that ram-bytes-treshold has been exceeded.

### `ram-percentage`
Percentage of dynamic memory used as reported by arduino-cli.

### `ram-percentage-exceeded`
Value '1' indicates that ram-percentage-treshold has been exceeded.

### `ram-remained`
Bytes of remained dynamic memory as reported by arduino-cli.

### `ram-remained-exceeded`
Value '1' indicates that ram-remained-treshold has been exceeded.

### `ram-total`
Total dynamic memory used as reported by arduino-cli.


## Example usage

```yaml
uses: rafw87/arduino-cli-compile-parser@v1
with:
  compile-log: ${{ steps.compile.outputs.log }}
  progmem-percentage-treshold: "95"
  ram-percentage-treshold: "75"
```
