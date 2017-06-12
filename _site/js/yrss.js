/* YRSS 1.0.3 */
/* Copyright (c) 2016 Mark Hillard - MIT License */

(function ($) {

    $.fn.rssfeed = function (url, options, fn) {

        // plugin defaults
        var defaults = {
            ssl: false,
            limit: 10,
            showerror: true,
            errormsg: '',
            tags: false,
            date: true,
            dateformat: 'default',
            titletag: 'h4',
            content: true,
            snippet: true,
            snippetimage: false,
            snippetlimit: 120,
            linktarget: '_self',
            defaultphoto: null
        };

        // extend options
        options = $.extend(defaults, options);

        // return functions
        return this.each(function (i, e) {
            // check for ssl protocol
            var s = '';
            if (options.ssl) { s = 's'; }

            // add class to container
            if (!$(e).hasClass('rssFeed')) { $(e).addClass('rssFeed'); }

            // check for valid url
            if (url === null) { return false; }

            // create yql query
            var query = 'http' + s + '://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from feed where url="' + url + '"');
            if (options.limit !== null) { query += ' limit ' + options.limit; }
            query += '&format=json';

            // send request
            $.getJSON(query, function (data, status, errorThrown) {
                // if successful... *
                if (status === 'success') {
                    // * run function to create html result
                    process(e, data, options);

                    // * optional callback function
                    if ($.isFunction(fn)) { fn.call(this, $(e)); }

                // if there's an error... *
                } else if (status === 'error' || status === 'parsererror') {
                    // if showerror option is true... *
                    if (options.showerror) {
                        // variable scoping (error)
                        var msg;

                        // if errormsg option is not empty... *
                        if (options.errormsg !== '') {
                            // * assign custom error message
                            msg = options.errormsg;

                        // if errormsg option is empty... *
                        } else {
                            // * assign default error message
                            msg = errorThrown;
                        }

                        // * display error message
                        $(e).html('<div class="rssError"><p>' + msg + '</p></div>');

                    // if showerror option is false... *
                    } else {
                        // * abort
                        return false;
                    }
                }
            });
        });
    };

    // create html result
    var process = function (e, data, options) {
        // feed data (entries)
        var entries = data.query.results.item;

        // check if entries are not inside an array (only 1 entry)
        if (!$.isArray(entries)) { entries = [entries]; }

        // abort if no entries exist
        if (!entries) { return false; }

        // html variables
        var html = '';
        var htmlObject;

        // for each entry... *
        $.each(entries, function (i) {
            // * assign entry variable
            var entry = entries[i];

            // * variable scoping (tags)
            var tags;

            // if entry tags exist... *
            if (entry.category !== undefined) {
                // * arrange entry tags
                tags = entry.category.toString().toLowerCase().replace(/ /g, '-').replace(/,/g, ' ');
            }

            // * variable scoping (date)
            var pubDate;

            // if date option is true... *
            if (entry.pubDate) {
                // * create date object
                var entryDate = new Date(entry.pubDate);

                // * select date format
                if (options.dateformat === 'default') {
                    pubDate = (entryDate.getMonth() + 1).toString() + '/' + entryDate.getDate().toString() + '/' + entryDate.getFullYear();
                } else if (options.dateformat === 'spellmonth') {
                    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    pubDate = months[entryDate.getMonth()] + ' ' + entryDate.getDate().toString() + ', ' + entryDate.getFullYear();
                } else if (options.dateformat === 'localedate') {
                    pubDate = entryDate.toLocaleDateString();
                } else if (options.dateformat === 'localedatetime') {
                    pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
                }
            }

            var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

            var node = $('#template .blog-cell').clone();
            node.find('.title').text(entry.title);
            node.find('.day').text(entryDate.getDate().toString());
            node.find('.month').text(months[entryDate.getMonth()]);
            node.find('.time').text(entryDate.getHours().toString() + ':' + entryDate.getMinutes().toString());
            node.find('.show-more a').attr('href', entry.link);

            // if content option is true... *
            if (options.content) {
                // * build content
                var content = entry.description;
                var tmp = document.createElement("DIV");
                tmp.innerHTML = content;
                content = tmp.textContent || tmp.innerText || "";
                node.find('.article-text').text(content);
            }

            html += node.wrap("<div>").parent().html();
        });

        // provisional html result
        htmlObject = $(html);

        // if content option is true... *
        if (options.content) {
            // for each entry... *
            $.each(htmlObject, function () {
                // if snippet option is true... *
                if (options.snippet) {
                    if (options.snippetimage) {
                        // * check for first image
                        var image = $(this).find('.article-text img').first();
                        var container = $(this).find('.img-wrap img');

                        // if image exists... *
                        if (image.length !== 0) {
                          container.attr('src', image.attr('src'));
                        }
                        else {
                          if(options.defaultphoto)
                            container.attr('src', options.defaultphoto);
                          else
                            container.remove();
                        }
                    }

                    // * set character limit
                    var content = $(this).find('.article-text');
                    var contentLength = $(content).text().length;
                    content.text(function (i, v) {
                        if (contentLength <= options.snippetlimit) {
                            return v;
                        } else {
                            return v.substring(0, options.snippetlimit) + ' ...';
                        }
                    });
                }
            });
        }

        // append final html result
        $(e).append(htmlObject);

        // apply target to links
        $('a', e).attr('target', options.linktarget);
    };

})(jQuery);
