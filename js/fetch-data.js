window.Fetcher = (function () {

    function handleReadyStateChange() {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                this.callback(JSON.parse(this.response));
            } else {
                window.alert("can't search movie");
            }
        }
    };

    function sendRequest(criteria, callback) {
        var httpRequest = new XMLHttpRequest();

        var type = criteria.substring(0, 2) === 'tt' ? 'i' : 's';
        var url = 'http://www.omdbapi.com/?' + type + '=' + criteria + '&plot=short&r=json';

        httpRequest.onreadystatechange = handleReadyStateChange;
        httpRequest.callback = callback;
        httpRequest.open('GET', url, true);
        httpRequest.send();
    };

    return {
        sendRequest: sendRequest
    }

})();
