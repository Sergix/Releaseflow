# Contributing to Releaseflow
First off, thanks for being interested in our project! I've put a lot of time and effort into simplifying the release process of your application by writing Releaseflow. This document is for you if (1) you have found an issue, (2) you would like to implement a new feature, or (3) would like to get started in long-term development of this project.

These guidelines should be reviewed before contributing to the Releaseflow project.

## About
Releaseflow simplifies the build-and-release process of any project. Releaseflow can automatically build documentation, changelogs, source packages, and executables without having to manually enter version info or other monotonous details that have been made automated.

## Implementation
This project is written in TypeScript, and implements a number of [`npm`](https://www.npmjs.com) dependencies, which can be found in the `package.json` file.

## Code of Conduct
The Code of Conduct for any contributions and posting information can be found [here](CODE_OF_CONDUCT.md).

## GitHub Branch
The development branch of the Releaseflow project is the `dev` branch. _**Make sure to work off of this branch, not the master!**_

## Builds
All builds compile to `.js` files that are stored in the `lib` folder. Only the most recent build is kept within the repository. (If you wish to build a previous version, download the associated source package.)  

## Source Code
Keep all updated and current source code in the /src directory.  
  
As mentioned in the "Builds" section, package the source code with every build into a ".zip" file and a tarball that should be placed in the /release/src directory when pushing a build. The format for the file should be as follows: `src-(version).(zip/tar.gz)`.  

## Versioning
Version numbers should use [Semantic Versioning](https://github.com/mojombo/semver/blob/master/semver.md).  
Numbering versions on files (such as released builds) should take the format of "X.Y.Z".

## Changelog
Every time an update is pushed, the changelog will be updated and pushed as well. It is highly recommended that every time you build you update the changelog. 

Once you add something to the changelog, DO NOT remove the entry, unless if, and only if, it is incorrect (such as a typo in the version number.) If you change a previous entry you must include a statement stating your change in a seperate entry.

The global changelog file is in the root folder of the project and is named "changelog.txt"; EVERY note will go into this file. It is also required that when you push a build you push an associated changelog file, formatted "changelog-(build version).txt". This file should be pushed to the /release/changelog directory. 

Changelog entry headings must be formatted as shown in the given example below. New changelog entries in the global "changelog.txt" file should be placed at the _top_ of the file, not the bottom. Simply create a few newlines before the latest entry and use the newlines to enter the new entry information. Entries must also be tab-indented.

The format for a changelog entry is as follows:
```
(#(entry))[MM/DD/YYYY-HH:MM (version) (username)]   
	(entry contents)   
	(entry contents)  
	(blank newline)  
```
Here is an example changelog:  
```
(#2)[2/2/2017-3:33 1.3 NCSGeek]     
	information uploaded.   
	added files.   
	pushed to github.   

(#1)[1/1/2017-3:33 1.0 Sergix]
	information uploaded.  
	pushed to github.  

```
Of course, a real changelog would be more descriptive in its entries.

Timestamps should be in 24-hour (aka military) time.

## Pull Requests
The PR name must be short but descriptive of its topic. A description must be made of the PR's purpose and a short description of the added code. Every PR must request to be reviewed by @Sergix.  

If the PR looks ready to go, it will be merged into the `master` branch. Documentation will then need to be written for the released code, whether it is a major, minor, or patch. This documentation will be published to the `/docs` folder.  

## Issues
If a new bug or issue is found, create a new Issue! The issue name must be short but descriptive, and must contain the following sections:  
1. "Description of Problem" - describe using words and/or pictures in full detail the problem you are experiencing.
2. "System Information" - include the following:
  - Build Environment (if building from source)
  - Version of npm
  - Operating System
  - Version of Releaseflow
3. "Files and Code" - If you find where the issue is or believe it to be, put the filenames and/or code in this section.

> Releaseflow v1.2.3    
> This project and its source are held under the GNU General Public License, located in the LICENSE file in the project's directory.  
> (c) 2018  