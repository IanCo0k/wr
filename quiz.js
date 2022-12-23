var oneTxt = document.querySelector('#one .text'),
    oneImg = document.querySelector('#one .image'),
    twoTxt = document.querySelector('#two .text'),
    twoImg = document.querySelector('#two .image'),
    completion = document.getElementById('completion'),

    items = [],

    totalJoin = (function() {
        var arr = [],
            total = 0;

        for (var i = 0; i < list.length; ++i) {
            arr.push(1);
        }

        while (arr.length > 1) {
            var a = arr.pop(),
                b = arr.pop(),
                c = a + b;
            total += c;
            arr.unshift(c);
        }

        return total;
    })(),


    prepItems = function(list) {
        list = list.map(function(item) {
            return [item];
        });
        items = list.sort(function() {
            return Math.random() > 0.5;
        }).reverse();
    };

var listOne = [],
    listTwo = [],
    joined = [],
    joinRunningTotal = 0,

    nextItems = function() {
        var remaining = listOne.length + listTwo.length,
            temp = listOne;

        // Swap the list every time so items never show in the same location twice in a row
        listOne = listTwo;
        listTwo = temp;

        completion.style.width = Math.min(Math.floor(100 * (joinRunningTotal + joined.length) / totalJoin), 100) + "%";

        // If there are items left in the lists we're sorting, queue them up to get sorted
        if (remaining > 0) {
            if (listTwo.length === 0) {
                while (listOne.length) {
                    joined.push(listOne.shift());
                }
                items.push(joined);
                joinRunningTotal += joined.length;
                nextItems();
                return;
            } else if (listOne.length === 0) {
                while (listTwo.length) {
                    joined.push(listTwo.shift());
                }
                items.push(joined);
                joinRunningTotal += joined.length;
                nextItems();
            } else {
                var e1 = listOne[0],
                    e2 = listTwo[0];
                oneImg.style.backgroundImage = e1.image ? "url(" + e1.image + ")" : "";
                oneTxt.innerHTML = e1.name
                twoImg.style.backgroundImage = e2.image ? "url(" + e2.image + ")" : "";
                twoTxt.innerHTML = e2.name
                return;
            }
        } else {
            if (items.length > 1) {
                listOne = items.shift();
                listTwo = items.shift();
                joined = [];
                nextItems();
                return;
            } else {
                // We're done, we only have one array left, and it's sorted
                var finalList = items[0].reverse().map(function(a) {
                    return a.name;
                }).join('</li><li>');
                var resultsDiv;

                resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = '<li>' + finalList;
                document.getElementById('wrapper').innerHTML = "";
                document.getElementById('progress').innerHTML = "";

                var type = "";
                var typeQuery = document.getElementById('stayhot').innerHTML;
                if (typeQuery.indexOf("QB") != -1) type = "qbRank";
                if (typeQuery.indexOf("NFL") != -1) type = "nflTeamRank";
                if (typeQuery.indexOf("NBA") != -1 &&
                    typeQuery.indexOf("All-Time") == -1) type = "nbaPlayerRank";
                if (typeQuery.indexOf("NBA") != -1 &&
                    typeQuery.indexOf("All-Time") != -1) type = "nbaGOATRank";

                var countList = new Map();

                for (let i = 0; i < items[0].length; i++) {
                    if (items[0][i].name.split(" ").length == 3) {
                        $.ajax({
                            type: 'get',
                            url: "get.php",
                            data: {
                                name: items[0][i].name.split(" ")[0] + "_" + items[0][i].name.split(" ")[1] +
                                    "_" + items[0][i].name.split(" ")[2],
                                type: type
                            },
                            success: function(data) {
                                countList.set(items[0][i].name, data);
                            }
                        });

                    } else if (items[0][i].name.split(" ")[1].indexOf("-") != -1) {
                        $.ajax({
                            type: 'get',
                            url: "get.php",
                            data: {
                                name: items[0][i].name.split(" ")[0] + "_" +
                                    items[0][i].name.split(" ")[1].replace("-", "_"),
                                type: type
                            },
                            success: function(data) {
                                countList.set(items[0][i].name, data);
                            }
                        });
                    } else if (items[0][i].name.split(" ")[0].indexOf("-") != -1) {
                        $.ajax({
                            type: 'get',
                            url: "get.php",
                            data: {
                                name: items[0][i].name.split(" ")[0].replace("-", "_") + "_" +
                                    items[0][i].name.split(" ")[1],
                                type: type
                            },
                            success: function(data) {
                                countList.set(items[0][i].name, data);
                            }
                        });
                    } else {
                        $.ajax({
                            type: 'get',
                            url: "get.php",
                            data: {
                                name: items[0][i].name.split(" ")[0] + "_" +
                                    items[0][i].name.split(" ")[1],
                                type: type
                            },
                            success: function(data) {
                                countList.set(items[0][i].name, data);
                            }
                        });
                    }
                }

                for (let i = 0; i < items[0].length; i++) {
                    items[0][i].rank = i + 1;
                    if (items[0][i].name.split(" ").length == 3) {
                        $.ajax({
                            type: 'get',
                            url: "quiz.php",
                            data: {
                                rank: i + 1,
                                name: items[0][i].name.split(" ")[0] + "_" + items[0][i].name.split(" ")[1] +
                                    "_" + items[0][i].name.split(" ")[2],
                                type: type
                            },
                            success: function(data) {
                                console.log(data);
                            }
                        });

                    } else if (items[0][i].name.split(" ")[1].indexOf("-") != -1) {
                        $.ajax({
                            type: 'get',
                            url: "quiz.php",
                            data: {
                                rank: i + 1,
                                name: items[0][i].name.split(" ")[0] + "_" +
                                    items[0][i].name.split(" ")[1].replace("-", "_"),
                                type: type
                            },
                            success: function(data) {
                                console.log(data);
                            }
                        });
                    } else if (items[0][i].name.split(" ")[0].indexOf("-") != -1) {
                        $.ajax({
                            type: 'get',
                            url: "quiz.php",
                            data: {
                                rank: i + 1,
                                name: items[0][i].name.split(" ")[0].replace("-", "_") + "_" +
                                    items[0][i].name.split(" ")[1],
                                type: type
                            },
                            success: function(data) {
                                console.log(data);
                            }
                        });
                    } else {
                        $.ajax({
                            type: 'get',
                            url: "quiz.php",
                            data: {
                                rank: i + 1,
                                name: items[0][i].name.split(" ")[0] + "_" + items[0][i].name.split(" ")[1],
                                type: type
                            },
                            success: function(data) {
                                console.log(data);
                            }
                        });
                    }
                }
                consensus(countList);
            }

        }
    },

    selected = function(which) {
        switch (which) {
            case 'one':
                joined.push(listTwo.shift());
                break;
            case 'two':
                joined.push(listOne.shift());
                break;
        }

        nextItems();
    };

prepItems(window.list);
nextItems();