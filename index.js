#!/usr/bin/env node
'use strict'; /*jslint node: true, es5: true, indent: 2 */
var fs = require('fs');

var started = Date.now();

var args = (function(argv) {
  var args = {}, f = 0;
  for (var arg, i = 0; (arg = argv[i]); i++) {
    if (arg.match(/^-.+/)) {
      var next = argv[i+1];
      if (arg.match(/=/)) {
        var parts = arg.split(/=/);
        arg = parts[0];
        next = parts.slice(1).join('=');
      }
      else if (next && !next.match(/^-.+/)) {
        i++;
      }
      else {
        next = true;
      }
      args[arg.slice(1)] = next;
    }
    else {
      args[f++] = arg;
    }
  }
  return args;
})(process.argv.slice(2)); // slice off the first two arguments, [node, iwc, ...]

var show_l = args.l; // lines
var show_w = args.w; // words
var show_c = args.c; // characters
if (!show_l && !show_w && !show_c) {
  show_l = show_w = show_c = true;
}

var count_l = 0;
var count_w = 0;
var count_c = 0;

function printCounts() {
  var counts = [];
  if (show_l)
    counts.push(count_l);
  if (show_w)
    counts.push(count_w);
  if (show_c)
    counts.push(count_c);
  process.stdout.write('\r' + counts.join('\t') + ' ', 'utf8');
}

var precision = 4;

function printRates() {
  var elapsed_seconds = (Date.now() - started) / 1000;
  var rates = [];
  if (show_l)
    rates.push((count_l / elapsed_seconds).toFixed(precision));
  if (show_w)
    rates.push((count_w / elapsed_seconds).toFixed(precision));
  if (show_c)
    rates.push((count_c / elapsed_seconds).toFixed(precision));
  process.stdout.write('\r' + rates.join('\t') + ' ', 'utf8');
}

var printLine = args.r ? printRates : printCounts; // rate

process.stdin.on('data', function(chunk) {
  if (show_l) {
    var newlines = chunk.match(/\n/g);
    if (newlines)
      count_l += newlines.length;
  }
  if (show_w) {
    var words = chunk.match(/\S+/g);
    if (words)
      count_w += words.length;
  }
  if (show_c) {
    count_c += chunk.length;
  }
  printLine();
});

process.stdin.on('end', function() {
  printLine();
  process.stdout.write('\n', 'utf8');
  process.exit(0);
});

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.on('SIGINT', function() {
  process.stdin.pause();
  process.stdout.write('\n', 'utf8');
  process.exit(1);
});
