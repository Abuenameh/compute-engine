#!/bin/bash

set -e  # exit immediately on error
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes
# set -x    # for debuging, trace what is being executed.

export BASENAME="\033[40m"MathJSON"\033[0m" # `basename "$0"`
export DOT="\033[32m ● \033[0m"
export CHECK="\033[32m ✔ \033[0m"
export LINECLEAR="\033[1G\033[2K" # position to column 1; erase whole line
export ERROR="\033[31m ERROR \033[0m"


# Note on the `sed` command:
# On Linux, the -i switch can be used without an extension argument
# On macOS, the -i switch must be followed by an extension argument (which can be empty)
# On Windows, the argument of the -i switch is optional, but if present it must follow it immediately without a space in between
sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i '' "$@"
}
export -f sedi

cd "$(dirname "$0")/.."
if [ "$#" -gt 1 ]; then
    echo -e "$BASENAME$ERROR Expected at most one argument: 'development' (default), 'watch' or 'production'"
    exit 1
fi

# Check that correct version of npm and node are installed
npx check-node-version --package

# If no "node_modules" directory, do an install first
if [ ! -d "./node_modules" ]; then
    printf "$BASENAME$DOT Installing dependencies"
    npm install
    echo -e "$LINECLEAR$BASENAME$CHECK Dependencies installed"
fi

# Read the first argument, set it to "development" if not set
export BUILD="${1-development}"


# export GIT_VERSION=`git describe --long --dirty`

export SDK_VERSION=$(cat package.json \
| grep version \
| head -1 \
| awk -F: '{ print $2 }' \
| sed 's/[",]//g' \
| tr -d '[[:space:]]')

# Clean output directories
printf "$BASENAME$DOT Cleaning output directories"
rm -rf ./dist
rm -rf ./declarations
rm -rf ./build
rm -rf ./coverage

mkdir -p dist
echo -e "$LINECLEAR$BASENAME$CHECK Output directories cleaned out"


# Build declaration files (.d.ts)
printf "$BASENAME$DOT Building declaration files (.d.ts)"
# Even though we only generate declaration file, the target must be set high-enough
# to prevent tsc from complaining (!)
npx tsc --target "es2020" -d --moduleResolution "node" \
  --emitDeclarationOnly --outDir ./dist/types ./src/math-json.ts 
# echo -e "$LINECLEAR$BASENAME$CHECK Declaration files built"

# Do build (development or production)
printf "\033[32m ● \033[0m Making a \033[33m%s\033[0m build" "$BUILD"
npx rollup --silent --config config/rollup.config.js
echo -e "$LINECLEAR$BASENAME$CHECK \033[33m" $BUILD "\033[0m build done"

if [ "$BUILD" = "production" ]; then    
    # Stamp the SDK version number
    printf "$BASENAME$DOT Stamping output files"
    find ./dist -type f \( -name '*.js' -o -name '*.mjs' \) -exec bash -c 'sedi s/{{SDK_VERSION}}/$SDK_VERSION/g {}' \;
    find ./dist -type f -name '*.d.ts' -exec bash -c 'sedi "1s/^/\/\* $SDK_VERSION \*\/$(printf '"'"'\r'"'"')/" {}' \;
    find ./dist -type f -name '*.d.ts' -exec bash -c 'sedi "s/{{SDK_VERSION}}/$SDK_VERSION/" {}' \;
    echo -e "$LINECLEAR$BASENAME$CHECK Output files stamped"

    # Linting
    # echo -e "\033[40m`basename "$0"`\033[0m 🚀 Linting"
    # npm run lint

    # Run test suite
    printf "$BASENAME$DOT Running test suite"
    npx jest --config ./config/jest.config.js ./test --silent --reporters jest-silent-reporter
    echo -e "$LINECLEAR$BASENAME$CHECK Test suite complete"
fi

