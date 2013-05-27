# Incremental word count

Display line, word, and chracter counts, just like `wc`, but updated with every chunk of data fed to stdin.

You can limit the counting to lines, words, or characters, like `wc`:

    iwc [-l] [-w] [-c]

It defaults to counting all three.

## E.g.:

    $ cat /usr/share/dict/words | iwc
    235886  235916  2493109

## Limitations:

* Only allows `STDIN` input (standard `wc` allows `STDIN` as well as filenames).
* It does not buffer or chunk intelligently, but simply uses

    process.stdin.on('data', function(chunk) { ... })

* `iwc -l` can be between 2-3x slower than `wc -l`.
* `iwc` and `iwc -w` are even slower, since they tokenize and count words.

## LICENSE

Copyright 2013, Christopher Brown. MIT Licensed.
