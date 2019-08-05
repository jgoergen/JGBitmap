function sizeInBytes(string) {

    var escaped_string = encodeURI(string);

    if (escaped_string.indexOf("%") != -1) {
        var count = escaped_string.split("%").length - 1;
        count = count == 0 ? 1 : count;
        count = count + (escaped_string.length - (count * 3));
    } else {
        count = escaped_string.length;
    }

    return count;
}

function getParameterByName(name) {

    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);

    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}