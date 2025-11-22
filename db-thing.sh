if [ -d "./src/lib/drizzle" ]; then
  rm -r ./src/lib/drizzle
  echo "Deleted existing drizzle directory."
else
  echo "No drizzle directory found, skipping deletion."
fi

drizzle-kit generate && drizzle-kit push