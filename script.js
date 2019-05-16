$(document).ready(function(){
    $.fn.setNow = function (onlyBlank) {
        var now = new Date($.now())
            , year
            , month
            , date
            , hours
            , minutes
            , seconds
            , formattedDateTime
        ;
        year = now.getFullYear();
        month = now.getMonth().toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
        date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
        hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
        minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
        seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();
        formattedDateTime = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes;
        if ( onlyBlank === true && $(this).val() ) {
            return this;
        }
        $(this).val(formattedDateTime);
        return this;
    };

    var info = [];
    var default_entry = {'email':"test@mailbox.com",
    'wildlife_name': 'American Robin',
    'observe_datetime': '2019-05-15T09:32',
    'observe_place': 'Discovery Park',
    'description': 'On the grass.',
    'img_src': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Turdus-migratorius-002.jpg'};
    info.push(default_entry);
    update_entry();

    function update_entry(){
        var previous_page = $('#previous');
        previous_page.empty();
        for (var i = 0; i < info.length; i++){
            previous_page.append("<div class=\"card\">\n" +
                "                    <img class=\"img-rounded\" alt=\"Uploaded image\" src=\""+info[i]['img_src']+"\">\n" +
                "                    <div class=\"card-text\">\n" +
                "                        <h5>"+info[i]['wildlife_name']+"</h5>\n" +
                "                        <p><b>Date & Time:&nbsp;</b> "+info[i]['observe_datetime']+"</p>\n" +
                "                        <p><b>Place:&nbsp;</b> "+info[i]['observe_place']+"</p>\n" +
                "                        <p><b>Description:&nbsp;</b>"+info[i]['description']+"</p>\n" +
                "                        <div>\n" +
                "                            <button class=\"btn-danger btn-sm card-button delete_entry\" id=\"delete_"+i.toString()+"\">Delete</button>\n" +
                "                        </div>\n" +
                "                    </div>\n" +
                "                </div>")
        }
    }

    $('#nav_previous_records').click(function () {
        var previous_page = $('#previous');
        if (previous_page.find('.card').size() !== info.length){
            update_entry();
        }
    });

    $('#nav_new_record').click(function f() {
        $('input[type="text"],input[type="email"], input[type="file"],textarea').val("");
        $('input[type="datetime-local"]').setNow();

    });

    $("#dialog").dialog({
        autoOpen: false,
        modal: true
    });

    $('#new_record').submit(function (event) {
        event.preventDefault();
        // Check uplaod file type
        var ext = $('#upload_image').val().split('.').pop().toLowerCase();
        var file = $('#upload_image').get(0).files[0];
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'bmp']) == -1 || !file){
            alert('Invalid upload file!');
            return;
        }
        $("#dialog").dialog({
            buttons: {
                "Confirm": function () {
                    var reader = new FileReader();
                    var new_entry = {
                        'email': $('#userEmail').val(),
                        'wildlife_name': $('#name_of_wildlife').val(),
                        'observe_datetime': $('#observe_datetime').val(),
                        'observe_place': $('#observe_place').val(),
                        'description': $('#description').val(),
                        'img_src': ''
                    };
                    var index = info.length;
                    info.push(new_entry);
                    reader.onload = function(){
                      var imgURL = reader.result;
                      info[index]['img_src'] = imgURL;
                      update_entry();
                    };
                    reader.readAsDataURL(file);
                    $(this).dialog("close");
                    $('#nav_previous_records').click();
                },
                "Cancel": function () {
                    $(this).dialog("close");
                }
            }
        });
        $("#dialog").dialog("open");
    });


    $('#previous').on('click', $('.delete_entry'), function (event) {
        event.preventDefault();
        var index = parseInt(event.target.id.substring(7));
        $("#dialog").dialog({
            buttons : {
                "Confirm" : function() {
                    info.splice(index, 1);
                    update_entry();
                    $(this).dialog("close");
                },
                "Cancel" : function() {
                    $(this).dialog("close");
                }
            }
        });
        $("#dialog").dialog("open");
    });

});