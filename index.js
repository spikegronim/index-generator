jQuery(document).ready(function($) {
    var input_elem         = $('#input_spreadsheet');
    var output_elem        = $('#output');
    var string_output_elem = $('#string_output');
    var bad_browser_elem   = $('#bad_browser');

    // run callback when our file has been uploaded
    function handle_upload(callback) {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            bad_browser_elem.show();
            return;
        }

        var input_elem = document.getElementById('input_spreadsheet');
        if (!input_elem.files || input_elem.files.length !== 1) {
            return;
        }

        var file = input_elem.files[0];
        if (!file) {
            return;
        }

        var text        = null;
        var file_reader = new FileReader();
        file_reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {
                callback(evt.target.result);
            }
        }
        file_reader.readAsText(file);
    }

    // http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
    function eliminate_duplicates(arr) {
        var i,
            len=arr.length,
            out=[],
            obj={};
  
        for (i=0;i<len;i++) {
            obj[arr[i]]=0;
        }
       
        for (i in obj) {
            out.push(Number(i));
        }
        return out;
    }

    // 1,2,3,5 -> 1-3,5
    // arr must be sorted
    function coalesce_runs(arr) {
        var result = [];
        var current = arr[0];
        var run_start = current;
        var run_length = 0;

        if (arr.length == 1) {
            return arr;
        }

        for (var i = 1; i < arr.length; i++) {
            if (arr[i] == current + 1) {
                run_length += 1;
                current = arr[i];
            } else {
                if (run_length == 0) {
                    result.push(run_start);
                } else {
                    result.push(run_start + "-" + (run_start + run_length));
                }

                run_start  = arr[i];
                current    = arr[i];
                run_length = 0;
            }
        }

        if (run_length == 0) {
            result.push(run_start);
        } else {
            result.push(run_start + "-" + (run_start + run_length));
        }

        return result;
    }

    function transform_input(text) {
        var split_rows = $.csv.toArrays(text);
        if (!split_rows[0][1].match(/^[0-9]+$/)) {
            // header row - non numeric page - remove it
            split_rows.shift();
        }

        // output is associative arrray from description -> pages
        var output = [];
        var record_count = split_rows.length;
        for (var i = 0; i < record_count; i++) {
            var row_length = split_rows[i].length;
            var page_number = Number(split_rows[i][1]);

            for (var j = 2; j < row_length; j++) {
                var description = split_rows[i][j];
                description = description.replace(/"/g, '');
                if (description.length == 0) {
                    continue;
                }
                if (!output[description]) {
                    output[description] = [];
                }
                output[description].push(page_number);
            }
        }

        // formatted is [desc, page, page, page]
        formatted = [];
        for (var description in output) {
            var page_numbers = output[description];
            page_numbers.sort();
            formatted.push([description].concat(coalesce_runs(eliminate_duplicates(page_numbers))));
        }

        // sort alphabetically on description
        formatted.sort(function(row_a, row_b) {
            if (row_a[0] < row_b[0]) {
                return -1;
            } else if (row_a[0] == row_b[0]) {
                return 0;
            } else {
                return 1;
            }
        });

        return formatted;
    }

    // output is the result of transformInput
    function format_output(output) {
        var string_output = $.map(output, function (row) {
            var item = '"' + row[0] + '"';
            var pages = row.splice(1, row.length);

            var string_pages =  pages.join(',');
            row_value = [item, '"' + string_pages + '"'].join(',');
            return row_value;
        }).join('\n');

        string_output_elem.attr('href', 'data:application/octet-stream,' + encodeURIComponent(string_output));

        output_elem.show();
    }

    input_elem.change(function (evt) {
        try {
            handle_upload(function (text) {
                format_output(transform_input(text));
            });
        } catch (err) {
            console.error(err);
        }
        return false;
    });


});
