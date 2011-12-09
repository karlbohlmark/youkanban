while true; do
  coffee -e "setTimeout -> throw 'error', 50"
done
