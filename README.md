# module-factory

> Module factory - module development scaffolding based on Webpack

## Install

Using npm:

```sh
$ npm install module-factory -g
```

Or using yarn:

```sh
$ yarn global add module-factory
```

## Usage

Create module scaffolding.

```sh
$ mod create <module-name>
```

If the directory file is already created.

```sh
$ cd path/to/<module-name>
$ mod create .
```

## Develop

In the module directory.

```sh
$ npm run dev
```

Or using yarn:

```sh
$ yarn dev
```

## Build

In the module directory.

```sh
$ npm run build
```

Or using yarn:

```sh
$ yarn build
```

The module is eventually built into the `./dist` directory.