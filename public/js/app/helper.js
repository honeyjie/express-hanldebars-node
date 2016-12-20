Handlebars.registerHelper('table', function(data) {
      var str = '<table>';
      for (var i = 0; i < data.length; i++ ) {
        str += '<tr>';
        for (var key in data[i]) {
          str += '<td>' + data[i][key] + '</td>';
        };
        str += '</tr>';
      };
      str += '</table>';

      return new Handlebars.SafeString (str);
    });
