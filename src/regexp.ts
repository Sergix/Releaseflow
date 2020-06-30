import * as colors from "colors";
import { rfconfig, projectPackage } from "./config";
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "constants";

export const regexp_int: string = "((\\d{2,4}(.(\\d[1-9])|([1-9]\\d))?)|[1-9])";
export const regexp_string: string = "[a-zA-Z0-9]+";
export const regexp_version: string =
  "([a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.[a-zA-Z0-9]+)";

const regexp_identifier: RegExp = /%%[a-zA-Z0-9]+%/;

export function replacer(input: string): string {
  let output: string = "";
  let option: string = "";

  let splitInput: string[] = input
    .replace("%n", regexp_int)
    .replace("%s", regexp_string)
    .replace("%v", regexp_version)
    .split(regexp_identifier);

  splitInput.map((item: string) => {
    // escape any nonalphanumeric characters
    item = item.replace("%", "").replace(/[^a-zA-Z0-9]/, (char: string) => {
      return "\\" + char;
    });

    if (projectPackage[item]) {
      return projectPackage.item;
    } else if (rfconfig[item]) {
      return rfconfig.item;
    } else {
      console.warn(
        colors.yellow(`Property "${option}" not found. Skipping...`)
      );
      return item;
    }
  });

  console.log(output);
  return output;
}
