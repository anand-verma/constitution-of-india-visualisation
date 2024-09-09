function generate_notify(config) {

    if (!config.text) {
      config.text = "Opps something went wrong.";
    }
    if (!config.notify) {
      config.notify = "success";
    }
  
    if (!config.position) {
      config.position = "bottomRight";
      //top - topLeft - topCenter - topRight - center - centerLeft - centerRight - bottom - bottomLeft - bottomCenter - bottomRight
    }
    if(!config.timeout){
      config.timeout = false;
    }
    
    $.noty.closeAll();
    var n = noty({
        text        : config.text,
        type        : config.notify,
        dismissQueue: false,
        layout      : config.position,
        theme       : 'defaultTheme',
        timeout     : config.timeout,
        animation: {
          open: {height: 'toggle'},
          close: {height: 'toggle'},
          easing: 'swing',
          speed: 1000
      },
    });
    return n;
  }
  
  function showAllValidationErrors(errors) {
    for (i in errors) {
      error = errors[i];
      noty({
        text        : error,
        type        : "error",
        dismissQueue: false,
        layout      : "bottomRight",
        theme       : 'defaultTheme'
      });
    }
  }
  