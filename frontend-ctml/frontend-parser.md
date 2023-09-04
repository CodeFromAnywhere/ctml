This script will parse your `.htm` components in the frontend, in realtime, as the user loads the page. For this script, all you need to do is put the script in your html:

```html
<script src="ctml.js"></script>
```

It's a work in progress but the most critical concept of nested compoenents is proven to work. The biggest limitation is the fact we can't normally fetch `file://`, so it's not really that useful in a dev environment where you open the file from your explorer. However, I made a small adaptation to circumvent this. The script will redirect all `file://` to a `localhost:3000` adress with the same path. For this, you need to run the `frontend-server.js`. It's best to keep it running across restarts (with something like pm2) and forget about it because it doesn't require restarts.

If you don't want to need the server, you can also start chrome with the `--allow-file-access-from-files` flag (other browsers may have similar functionalities). This allows us to fetch from the file system using `file://`. I did not opt for this solution because it seems very unsecure. More info here: http://localhost
https://stackoverflow.com/questions/10752055/cross-origin-requests-are-only-supported-for-http-error-when-loading-a-local
