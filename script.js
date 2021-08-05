// We would normally use an HTTP request to fetch the XML data from a file on a
// remote server. Access control disallows that on local files. As a workaround,
// we inline the XML as a JavaScript string that we can parse directly.

// Function to fetch XML over HTTP. We're NOT using this one, but worth seeing.
function loadXMLDataHttp()
{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            loadXMLData(this.responseXML);
        }
    };

    xhttp.open("GET", "data.xml", true);
    xhttp.send();
}

// Function to fetch XML inline. We ARE using this one.
// See https://www.w3schools.com/xml/xml_parser.asp for more information.
function loadXMLDataInline()
{
    var parser = new DOMParser;
    var xml = parser.parseFromString(inlineXML, "text/xml");

    loadXMLData(xml);
}

// Function to process XML into HTML and event handlers.
function loadXMLData(xml)
{
    var items = xml.getElementsByTagName("ITEM");

    insertAccordion(items);
    activateAccordion(items);

    var years = xml.getElementsByTagName("YEAR");
    var genres = xml.getElementsByTagName("GENRE");

    insertFilter(years, genres);
    activateFilter();
}

// Convenience function to extract the value of a tag from the XML.
// See https://www.w3schools.com/xml/ for more information.
function getItemTagValue(item, tag)
{
    return item.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
}

//******************************************************************************

// Inlined version of our XML data for use by loadXMLDataInline().
// See data.xml for the same XML in a format that is easier to read.
var inlineXML = "<DATA><ITEM><ID>0001</ID><IMDB>tt0088258</IMDB><TITLE>h</TITLE><GENRE>Horror</GENRE><DESCRIPTION>A controversial, one-take cinematographic masterpiece pushing the boundaries of film and entertainment, this is a harrowing-yet-hilarious look into the life of an indifferent university student as he questions the utility of his work and seeks to restore meaning to his life.</DESCRIPTION><YEAR>2018</YEAR><DURATION>0:00:08</DURATION></ITEM><ITEM><ID>0002</ID><IMDB>tt0241527</IMDB><TITLE>Harry Potter And The Sorcerer's Stone</TITLE><GENRE>Fantasy</GENRE><DESCRIPTION>Rescued from the outrageous neglect of his aunt and uncle, a young boy with a great destiny proves his worth while attending Hogwarts School of Witchcraft and Wizardry.</DESCRIPTION><YEAR>2001</YEAR><DURATION>2:32:21</DURATION></ITEM><ITEM><ID>0003</ID><IMDB>tt0446029</IMDB><TITLE>Scott Pilgrim Vs. The World</TITLE><GENRE>Fantasy</GENRE><DESCRIPTION>Scott Pilgrim must defeat his new girlfriend's seven evil exes in order to win her heart.</DESCRIPTION><YEAR>2010</YEAR><DURATION>1:52:23</DURATION></ITEM><ITEM><ID>0004</ID><IMDB>tt0379786</IMDB><TITLE>Serenity</TITLE><GENRE>Science Fiction</GENRE><DESCRIPTION>The crew of the ship Serenity tries to evade an assassin sent to recapture one of their number, who is telepathic.</DESCRIPTION><YEAR>2005</YEAR><DURATION>1:59:03</DURATION></ITEM><ITEM><ID>0005</ID><IMDB>tt0338013</IMDB><TITLE>Eternal Sunshine Of The Spotless Mind</TITLE><GENRE>Science Fiction</GENRE><DESCRIPTION>A couple undergo a procedure to erase each other from their memories when their relationship turns sour, but it is only through the process of loss that they discover what they had to begin with.</DESCRIPTION><YEAR>2004</YEAR><DURATION>1:47:47</DURATION></ITEM></DATA>";

//******************************************************************************

// Function to build HTML from the XML data and insert it into the id=accordion
// <div> element in main.html. Creates a pair of <div>s for each data item: one
// for a summary and one for details.
function insertAccordion(items)
{
    var s = "";

    // Loop through the ITEMs in the data
    for (var i = 0; i < items.length; i++)
    {
        var itemID = getItemTagValue(items[i], "ID");
        var overallID = "overall-" + itemID;
        var summaryID = "summary-" + itemID;
        var detailsID = "details-" + itemID;

        // Open a <div> block for the item overall.
        // (Use #itemID in an href to link to this <div> on the main page.)
        s += "<div class=\"item-overall\"id=\"" + overallID
                + '" data-genre="' + getItemTagValue(items[i], "GENRE")
                + '" data-year="' + getItemTagValue(items[i], "YEAR")
                + "\">";

        // Build a <div> block for the item summary.
        s += "<div class=\"item-summary\" id=\"" + summaryID + "\">";
        s += buildItemSummary(items[i]);
        s += "</div>";

        // Build a <div> block for the item details.
        s += "<div class=\"item-details\" id=\"" + detailsID + "\">";
        s += buildItemDetails(items[i]);
        s += "</div>";

        // Close the <div> block for the item overall.
        s += "</div>";
    }

    // Insert the built HTML into the id=accordion <div> in main.html.
    document.getElementById("items").innerHTML = s;
}

// After inserting the <div>s, add a click event listener to each summary to
// show/hide the corresponding details. Also add hooks to expand/collapse all.
function activateAccordion(items)
{
    // Again, loop through the ITEMs in the data
    for (var i = 0; i < items.length; i++)
    {
        var itemID = getItemTagValue(items[i], "ID");
        var summaryID = "summary-" + itemID;

        // Add a click listener to the item summary. When clicked, toggle the
        // sibling element, which we've set up to be the corresponding details.
        $("#" + summaryID).click(function(){ $(this).next().slideToggle(); });
    }

    // Event listeners for elements to expand/collapse all items.
    $("#show-all").click(function(){ $("[id^='details-']").slideDown(); });
    $("#hide-all").click(function(){ $("[id^='details-']").slideUp(); });
}

// Function to build HTML to display the summary of a data item. Complete this
// to implement the "collapsed items" aspect of the main page specification.
function buildItemSummary(item)
{
    return '<p class="title">'
            + getItemTagValue(item, "TITLE")
            + '</p>'
            + '<p class="year">'
            + getItemTagValue(item, "YEAR")
            + '</p>';
}

// Function to build HTML to display the details of a data item. Complete this
// to implement the "expanded items" aspect of the main page specification.
function buildItemDetails(item)
{
    return '<img src="images/'
                + getItemTagValue(item, "ID")
                + '.jpg" height="377px" width="255px">'
            + '<div class="details">'
                + '<span class="small-title">'
                    + getItemTagValue(item, "TITLE")
                    + '</span>'
                + '<span class="year"> ('
                    + getItemTagValue(item, "YEAR")
                    + ')</span>'
                + '<p class="genres">'
                    + getItemTagValue(item, "GENRE")
                    + '</p>'
                + '<p class="description">'
                    + getItemTagValue(item, "DESCRIPTION")
                    + '</p>'
                + '<button class="details-button accordion" onclick="javascript:location.href=\'items/'
                    + getItemTagValue(item, "ID")
                    + '.html\'">Details</button>'
                + '<p class="duration">Duration: '
                    + getItemTagValue(item, "DURATION")
                    + '</p>'
                + '</div>';
}

// Function to build HTML from the XML data and insert it into the id=filter
// <div> element in main.html. Creates a <form> with checkbox <input>s for each
// unique year in the data.
function insertFilter(years, genres)
{
    var s = "";
    var y = new Array();
    var g = new Array();

    for (var i = 0; i < years.length; i++)
    {
        y.push(years[i].childNodes[0].nodeValue);
        g.push(genres[i].childNodes[0].nodeValue);
    }

    // Sort and remove duplicates
    y = y.sort((a, b) => {return b-a}).filter(function(v, i, a) {
        return ((i == a.length - 1) || (a[i + 1] != v));
    });
    g = g.sort().filter(function(v, i, a) {
        return ((i == a.length - 1) || (a[i + 1] != v));
    });
    
    s += "<form>";

    s += "<h2>Years</h2>";
    y.forEach(year => {
        s += '<input checked name="year" type="checkbox" value="'
                + year + '">' + year + '<br>'
    });

    s += "<h2>Genres</h2>";
    g.forEach(genre => {
        s += '<input checked name="genre" type="checkbox" value="'
                + genre + '">' + genre + '<br>'
    });

    s += "</form>";

    // Insert the built HTML into the id=accordion <div> in main.html.
    document.getElementById("filter").innerHTML = s;
}

// After inserting the <form>, add a click event listener to each checkbox
function activateFilter()
{
    // Year checkboxes
    $("div#filter").find("input[name='year']").on("click", function () {
        $("[id^='overall-']").hide();
        $("div#filter").find("input:checked[name='year']").each(function() {
            $("[data-year='" + $(this).val() + "']").show();
            console.log($(this).val())
        })
    });

    // Genre checkboxes
    $("div#filter").find("input[name='genre']").on("click", function () {
        $("[id^='overall-']").hide();
        $("div#filter").find("input:checked[name='genre']").each(function() {
            $("[data-genre='" + $(this).val() + "']").show();
            console.log($(this).val())
        })
    });
}
