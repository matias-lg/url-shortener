const frm = $("#main-form");
frm.submit(
    (e) => {
        e.preventDefault();
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: (response) => {
                console.log(response);
                let new_url_div = $(`
                <div id="new-url-div" class="form-group row">
                Your new url is ${window.location.href + response.shortened_url}
                </div>`);
                $(".url-input").after(new_url_div);
            },
            error: (response) => {
                let new_url_div = $(`
                <div id="new-url-div" class="input-group mb-3">
                Error: ${response.responseJSON.error}
                </div>`);
                $(".url-input").after(new_url_div);
            }
        });
    });
