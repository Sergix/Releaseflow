# Releaseflow CLI Documentation

Releaseflow is an application designed to make documentation and deploying easier and less headache-ey.

## Possible Arguments
```
-V, --version        output the version number  
-l, --changelog      build changelog  
-d, --docs           build documentation template  
-e, --exec           build executable  
-c, --config <path>  set config path  
-s, --source         package source code  
-h, --help           output usage information  
```

## rfconfig.json
All the configuration for your project is stored here, formatted as a JSON object. If the file does not exist, Releaseflow will auto-generate a template for you in your project's directory.

`package`: path to your project's descriptor (i.e. Node.js's `package.json`)  
`markdown`: whether to use markdown in documentation or not  
`docs`: information used when generating documentation  
&nbsp;&nbsp;&nbsp;&nbsp;`title`: title of the document  
&nbsp;&nbsp;&nbsp;&nbsp;`dist`: output folder path  
&nbsp;&nbsp;&nbsp;&nbsp;`template`: create sections here you would like to appear in the documentation  
`changelog`: information used when generating the project's formatted changelog  
&nbsp;&nbsp;&nbsp;&nbsp;`path`: input file  
&nbsp;&nbsp;&nbsp;&nbsp;`header_format`: the format of each entry's header  
&nbsp;&nbsp;&nbsp;&nbsp;`replace_links`: replace issue/pull request identifiers with actual links (i.e. `#1` is replaced by `[#1](https://www.github.com/user/repo/issues/1)`)  
&nbsp;&nbsp;&nbsp;&nbsp;`dist`: output folder path  
`source`: information used when compressing the source code  
&nbsp;&nbsp;&nbsp;&nbsp;`dir`: array of glob strings (i.e. `*.txt`, `src/*.*`) of paths to files and folders that should be included  
&nbsp;&nbsp;&nbsp;&nbsp;`dist`: output folder path  
&nbsp;&nbsp;&nbsp;&nbsp;`compression`: compression format, either `zip` or `tar` (Note: tar's are also gzipped)  
`exec`: command used to build the project  

For the `title` and `template` sections in `docs`, project information may be interpolated into the contents by using the following identifiers:  
`%%changelog%`: the project's generated, formatted changelog    
`%%toc%`: table of contents  

Any property present in the project's properties file (i.e. `package.json`, `pom.xml`) may be interpolated as well. Examples:  
`%%license%`, `%%artifactId%`, `%%version%`, `%%name%%`  

For the `header_format` property _only_, you can supply the following identifiers:  
`%n`: integer  
`%s`: string  

An example `header_format` would look something like this:  
`(#%n)[%n/%n/%n-%n:%n %%version% %s]` would be the formatted string for `(#23)[4/2/2018-11:12 1.2.0 beta]`