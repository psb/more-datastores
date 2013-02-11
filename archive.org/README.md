# archive.org

In this project, you'll rewrite part of http://archive.org, a web service that archives sites on the internet.  Your version will allow users to submit a URL, and you'll archive it (by getting a copy of that website off of the internet) and show them your copy.

Your application will consist of two separate node applications.
* The first will be a web service that serve pages over the web using a RESTful API
  * It can accept new URLs that the user wants to be archived. It will do this via a POST request and save them to a file on your computer.
* The second application will read the list of URLs from your file and go get the URLs from the internet, saving them onto your computer.
  * You'll run this one on a regular basis, using [cron](http://benr75.com/pages/using_crontab_mac_os_x_unix_linux).

## What's in this repo

The two above-mentioned node applications live in `web/` and `workers/`, respectively.  `spec` and `specHelpers` contain code related to the jasmine specs.  

`data` holds the files that the web and worker applications interact with.  You'll see two files in there right now:
* `data/sites.txt` has a URL in it.  Your web application will add more URLs to the end of that file, and your worker application will read the list whenever it runs.
* `data/sites/www.google.com` has google's HTML in it.  Your worker application will add more files to this directory, and your web application will serve these files.

## A few notes

* Getting documents from other servers using node's `http` package is a big pain in the ass.  You're welcome to use a library like https://github.com/SaltwaterC/http-get.
* HTTP documents are often somewhat broken when they're opened in a different context, for reasons related to links to CSS and JS files.  Don't worry about that.

## Your goals
You should:
* Make the specs pass.
* Write a script in `workers/htmlfetcher.js` that uses the code in `workers/lib/html-fetcher-helpers.js` to download files when it runs (and then exit).
* Run the above script every minute by using [cron](http://benr75.com/pages/using_crontab_mac_os_x_unix_linux).

Extra credit:
* Rather than using a library to help download a file over http, use the 'http' module.
* Store multiple versions of the same site.
