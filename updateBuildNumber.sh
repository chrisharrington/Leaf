echo $TRAVIS_BUILD_NUMBER
echo $HEROKU_API_KEY_BASE64
echo '{"BUILD_NUMBER": $TRAVIS_BUILD_NUMBER }'
curl -n -X PATCH https://api.heroku.com/apps/leaf-issue-tracker/config-vars \
-H "Accept: application/vnd.heroku+json; version=3" \
-H "Authorization: $HEROKU_API_KEY_BASE64" \
-H "Content-Type: application/json" \
-d '{"BUILD_NUMBER": $TRAVIS_BUILD_NUMBER }'