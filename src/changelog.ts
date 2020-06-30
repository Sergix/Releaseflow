import * as regexp from "./regexp";
import { stringify, replacer, filenameHandler } from "./util";
import * as colors from "colors";
import * as fs from "fs";
import { rfconfig, projectPackage } from "./config";

export let current: Array<string> = [];

export function get(): Array<string> {
  const data: Array<string> = [];
  const fileContents: string = fs
    .readFileSync(rfconfig.changelog.path)
    .toString();
  let line: string = "";

  for (let i = 0; i < fileContents.length; i++) {
    if (fileContents[i] === "\n") {
      rfconfig.changelog.ignore.forEach((x: string) => {
        if (x !== line.trim())
          // if we need to ignore the line
          data[data.length] = line.trim();
      });
      line = "";
      continue;
    }

    if (fileContents[i] !== "\r") {
      // skip return carriage
      line += fileContents[i];
    }
  }

  data[data.length] = line.trim();
  return data;
}

export function match(x: Array<string>): Array<string> {
  const data: Array<string> = [];
  const testString: string = regexp.replacer(rfconfig.changelog.header_format);
  const regex: RegExp = new RegExp(testString);
  let flag_r: boolean = false,
    flag_m: boolean = false;
  let split: Array<string> = [];
  let line: string = "";
  let j: number;

  split = testString.split("\n");

  if (split !== []) {
    // if the format string is a multi-line header
    flag_m = true;
  }

  for (let i = 0; i < x.length; i++) {
    if (!flag_r) {
      // if we are not currently reading an entry
      if (flag_m) {
        // if it's a multi-line header format
        flag_r = true; // set flag preliminarily to true
        for (j = 0; j < split.length; j++) {
          // loop through split array
          if (new RegExp(split[j].trim()).test(x[i + j])) {
            // if the regex matches the current header line we are trying to match
            continue; // then continue to the next line of the header
          } else {
            // if it's not a match
            j = 0;
            flag_r = false;
            break; // quit the loop, attempt to find a new header match
          }
        }
      } else {
        // if it's a single-line header
        if (regex.test(x[i])) {
          // if the string matches the header format
          flag_r = true; // then we are going to read an entry on the next iteration
        }
      }

      // here, we matched a multi-header
      i += j - 1; // so add the length of the header to the index of the line we want to read next
      continue; // and move to the next iteration
    }

    if (x[i] === "\n" || x[i] === "") {
      // if the data is a newline, it is the end of entry
      flag_r = false;
      continue;
    }

    line = x[i].trim();

    if (!line.startsWith("-")) {
      line = "- " + line;
    }

    if (rfconfig.changelog.replace_links) {
      line = replacer(line, { links: true });
    }

    data.push(line);
  }

  return data;
}

export function release(file: boolean = true): void {
  const ext: string = rfconfig.markdown ? "md" : "txt";
  let filename: string = replacer(rfconfig.changelog.dist, {
    interpolate: true
  });

  current = match(get());

  filename = filenameHandler(filename, ext, "changelog", "changelog");

  // Write the contents to the file!
  fs.writeFile(filename, stringify(current), err => {
    if (!err) {
      console.info(
        colors.green("Finished writing changelog. Wrote to"),
        colors.bgGreen.white(`${filename}`)
      );
    } else {
      console.error(
        colors.red("ERROR: Failed to create changelog at"),
        colors.red.underline(`${filename}`),
        colors.red(". Perhaps the directory doesn't exist?")
      );
    }
  });
}
