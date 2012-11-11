jQuery(document).ready(function($) {
    var input_elem         = $('#input_spreadsheet');
    var output_elem        = $('#output');
    var string_output_elem = $('#string_output');
    var table_output_elem  = $('#table_output');
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

    function transform_input(text) {
        split_rows = $.csv.toArrays(text);
        if (!split_rows[0][0].match(/^[0-9]/)) {
            // header row - remove it
            split_rows.shift();
        }

        // sort alphabetically on term
        split_rows.sort(function(row_a, row_b) {
            console.log(row_a[1] + ' ' + row_b[1]);
            if (row_a[1] < row_b[1]) {
                return -1;
            } else if (row_a[1] == row_b[1]) {
                return 0;
            } else {
                return 1;
            }
        });

        var output = [];
        var group = [];
        var last_item = null;
        for (var i = 0; i < split_rows.length; i++) {
            var page = split_rows[i][0];
            var item = split_rows[i][1];
            if (last_item === null || last_item !== item) {
                if (group.length > 0) {
                    group = $.map(group, function(str) { return Number(str) });
                    group.sort(function (a, b) {
                        if (a < b) {
                            return -1;
                        } else if (a == b) {
                            return 0;
                        } else {
                            return 1;
                        }
                    });
                    output.push([last_item, group]);
                }
                group = [];
            }

            group.push(page);
            last_item = item;
        }

        return output;
    }

    // output is the result of transformInput
    function format_output(output) {
        var string_output = $.map(output, function (row) {
            var item = '"' + row[0] + '"';
            var pages = row[1];

            var string_pages = '"' + pages.join(',') + '"';
            row_value = [item, string_pages].join(',');
            return row_value;
        }).join('\n');
        string_output_elem.attr('href', 'data:application/octet-stream,' + encodeURIComponent(string_output));

        var table_html = '<table>';
        for (var row in output) {
            table_html += '<tr>';
            for (var item in output[row]) {
                table_html += '<td>' + output[row][item] + '</td>';
            }
            table_html += '</tr>';
        }
        table_html += '</table>';
        table_output_elem.html(table_html);

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
