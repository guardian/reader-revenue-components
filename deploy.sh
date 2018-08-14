#!/usr/bin/env bash

DIR=$(dirname "$0")
cd "${DIR}"

yarn run build

upload_file () {
    FILE="$1"
    UPLOAD_PATH="$2"
    
    aws s3 cp \
        --profile membership \
        --region eu-west-1 \
        --acl public-read "./dist/${FILE}" "s3://reader-revenue-components/${UPLOAD_PATH}/${FILE}" \
        --cache-control 60 \
        --metadata '{"surrogate-control":"86400"}'
    
    curl -X PURGE "https://support.code.dev-theguardian.com/${UPLOAD_PATH}/${FILE}"
    curl -X PURGE "https://support.theguardian.com/${UPLOAD_PATH}/${FILE}"
}

upload_file "index.html"                 "epic/iframe-or-not-test"
upload_file "paypal-and-credit-card.png" "epic/iframe-or-not-test"
