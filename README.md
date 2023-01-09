# @baltpeter/generator-ts

> A Yeoman generator that I for scaffolding TypeScript modules.

This Yeoman generator generates the TypeScript boilerplate I use for my modules, using my configs for ESLint, Prettier and TypeScript. You probably don't want to use this unless you're working on a project with me.

## Installation

You first need to install `yo` and this generator:

```sh
npm i -g yo @baltpeter/generator-ts
```

## Usage

After installing, you can run the generator with:

```sh
yo @baltpeter/ts
```

The generator will interactively prompt you for the module name and some other information. You can also pass most of these options as command line arguments. Use `yo @baltpeter/ts --help` to see all available options:

```
$ yo @baltpeter/ts --help
Usage:
  yo @baltpeter/ts:app [<moduleName>] [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers                          Default: false
        --skip-install   # Do not automatically install dependencies               Default: false
        --force-install  # Fail on install dependencies error                      Default: false
        --ask-answered   # Show prompts for already configured options             Default: false
        --description    # A short one-sentence description of the module.
        --name           # Your name.
        --email          # Your email.
        --githubRepo     # The GitHub repository where the module will be stored.

Arguments:
  moduleName  # The name of the module (this will also be the output directory).  Type: String  Required: false
```

## LICENSE

This generator and the boilerplate it generates are licensed under the CC0 license, see the [`LICENSE`](LICENSE) file for details.
