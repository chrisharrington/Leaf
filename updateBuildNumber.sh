echo "Starting build number update."
curl -n -X PATCH https://api.heroku.com/apps/leaf-issue-tracker/config-vars \
-H "Accept: application/vnd.heroku+json; version=3" \
-H "Authorization: $HEROKU_API_KEY_BASE64" \
-H "Content-Type: application/json" \
-d '{"BUILD_NUMBER": $TRAVIS_BUILD_NUMBER }'
echo "Build number updated."