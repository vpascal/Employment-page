jQuery(document).ready(function() {
    jQuery(".titleWrapper").addClass("ready");

    jQuery(".titleWrapper h1").each(function() {
        var fullString;
        var characters = jQuery(this).text().split("");

        $this = jQuery(this);
        $this.empty();
        $.each(characters, function(i, el) {
            if (el == " ") { el = "&nbsp;" };
            $this.append("<span>" + el + "</span");
        });

    });

});


// logos for treemap

var png = [{
        "naics2_descr": "Accommodation & Food Services",
        "image": "icons/food.png",
        "hex": "#ff7b22"
    },
    {
        "naics2_descr": "Admin. & Support & Waste Management & Remediation Services",
        "image": "icons/adminsupport.png",
        "hex": "#C32B97"
    },
    {
        "naics2_descr": "Agriculture, Forestry, Fishing & Hunting",
        "image": "icons/agriculture.png",
        "hex": "#FFD4AA"
    },
    {
        "naics2_descr": "Arts, Entertainment, & Recreation",
        "image": "icons/arts.png",
        "hex": "#FDBA91"
    },
    {
        "naics2_descr": "Construction",
        "image": "icons/construction.png",
        "hex": "#ba044f"

    },
    {
        "naics2_descr": "Education",
        "image": "icons/education.png",
        "hex": "#00694E"
    },
    {
        "naics2_descr": "Finance & Insurance",
        "image": "icons/finance.png",
        "hex": "#E57352"
    },
    {
        "naics2_descr": "Health Care & Social Assistance",
        "image": "icons/healthcare.png",
        "hex": "#187ED0"
    },
    {
        "naics2_descr": "Information",
        "image": "icons/information.png",
        "hex": "#956587"
    },
    {
        "naics2_descr": "Management of Companies & Enterprises",
        "image": "icons/management.png",
        "hex": "#FFC7CE"
    },
    {
        "naics2_descr": "Manufacturing",
        "image": "icons/manuf.png",
        "hex": "#45778B"
    },
    {
        "naics2_descr": "Mining, Quarrying, & Oil & Gas Extraction",
        "image": "icons/mining.png",
        "hex": "#FFD4AA"
    },
    {
        "naics2_descr": "Other Services",
        "image": "icons/other.png",
        "hex": "#FDBA70"
    },
    {
        "naics2_descr": "Professional, Scientific, & Technical Services",
        "image": "icons/science.png",
        "hex": "#FBF096"
    },
    {
        "naics2_descr": "Public Administration",
        "image": "icons/government.png",
        "hex": "#5BA5D0"
    },
    {
        "naics2_descr": "Real Estate & Rental & Leasing",
        "image": "icons/realestate.png",
        "hex": "#B2BA89"
    },
    {
        "naics2_descr": "Retail",
        "image": "icons/retail.png",
        "hex": "#C5A233"
    },
    {
        "naics2_descr": "Transportation & Warehousing",
        "image": "icons/transportation.png",
        "hex": "#4233C5"
    },
    {
        "naics2_descr": "Utilities",
        "image": "icons/utilities.png",
        "hex": "#4286f4"
    },
    {
        "naics2_descr": "Wholesale Trade",
        "image": "icons/wtrade.png",
        "hex": "#33C5B3"
    }
]

//naics description: provides sector description under treemap

function naics_info() {
    d3.csv('data/description.csv', function(data) {
        newset = data.filter(function(d) { return d.name == naics; });

        document.getElementById('naics').innerHTML = "";

        d3.select('#naics')
            .selectAll('p')
            .data(newset)
            .enter()
            .append('p')
            .text(function(d) { return d.description });
    });
}

// treemap

var visualization = d3plus.viz()
    .container('#treemap')
    .data('data/finalother.csv')
    .type("tree_map")
    .id(['naics2_descr', 'naics3_descr'])
    .font({ "family": "Raleway, sans-serif" })
    .size({ 'solo': function(x) { return x > 10 }, 'value': 'n' })
    .labels({ "align": "left", "valign": "top" })
    .tooltip({ 'children': 0 })
    .tooltip({ "font": { "family": "Raleway, sans-serif" } })
    .attrs(png)
    .color('hex')
    .footer({ "value": "Source: Ohio Education Research Center", "link": "http://oerc.osu.edu/" })
    .tooltip({ "sub": "description" })
    .title("Click to drill down and Back to return")
    .icon({
        "style": "knockout",
        "value": "image"
    })
    .mouse({

        "click": function(value, viz) {
            naics = value.naics2_descr;
            console.log(naics);
            naics_info();
            if (value.naics2_descr != "Information" & value.naics2_descr != 'Manufacturing') { return true; }

        }
    })
    .ui([{
        "label": "Change View",
        "type": "button",
        "value": [{ "NAICS 2 digit": "naics2_descr" }, { "NAICS 3 digit": "naics3_descr" }],
        "method": function(value, viz) {
            if (value == "naics3_descr") {
                viz.id({ "value": "naics3_descr" })
                    .draw();
            } else {
                viz.id({ "value": ['naics2_descr', 'naics3_descr'] })
                    //.attrs(attributes)
                    //.color("hex")
                    .draw();
            }
        }
    }])
    .draw()


// Growing& declining industries in OH

var ohioviz = d3plus.viz().container("#ohio");
d3.csv("data/ohio.csv", function(error, temp) {
    if (error) return console.error(error);
    temp.forEach(function(d) {
        d3.keys(d).forEach(function(k) {
            if (k == "percent") {
                d[k] = +d[k]
            }
        })
    })
    ohioviz
        .data(temp)
        .type("bar")
        .id(['industry', 'color'])
        .x('percent')
        .y({ 'value': 'industry', 'scale': 'discrete' })
        .color('color')
        .text("industry")
        .order({ "value": "percent" })
        .title({ 'value': 'Industries (click to select/deselect)' })
        .mouse({
            'click': function(value, viz) {
                ohiodetail.id({ 'value': ['industry', 'subsector'], 'solo': value.industry })
                    .draw()
                return null
            }
        })
        .icon({
            "style": "knockout",
            "value": "image"
        })
        .legend({ 'filters': true, 'data': false })
        .font({ "family": "Raleway, sans-serif" })
        .draw()


})


// ohio subsectors barchart detail
var ohiodetail = d3plus.viz()
    .container("#ohiodetail")
    .data('data/sectors.csv')
    .type("bar")
    .id(['industry', 'subsector'])
    .x({ 'value': 'percent', 'range': [-10, 10] })
    .y({ 'value': 'industry', 'scale': 'discrete' })
    .title('Subsectors')
    .depth(1)
    .text('subsector')
    .order({ "value": "percent" })
    .legend({ 'filters': true, 'data': false })
    .font({ "family": "Raleway, sans-serif" })

ohiodetail.draw();


//percent employed chart

var barviz = d3plus.viz().container("#bar");
d3.csv("data/employfinal.csv", function(error, temp) {
    if (error) return console.error(error);
    console.log(temp);
    temp.forEach(function(d) {
        d3.keys(d).forEach(function(k) {
            if (k == "Undergraduate") {
                d[k] = +d[k]
            }
        })
    })
    barviz
        .data(temp)
        .type("bar")
        .id("Year")
        .x({ 'value': 'Period', 'label': { 'font': { 'size': 16 } } })
        .y("Undergraduate")
        .time({ "value": "Year", "solo": 2016 })
        .font({
            "size": 14,
            "family": "Raleway, sans-serif"
        })
        .ui([{
            "label": "Select Level",
            "type": "button",
            "value": [{ "Undergraduate": "Undergraduate" }, { "Graduate": "Graduate" }, { "College": "College" }],
            "method": function(value, viz) {
                if (value == "College") {
                    viz.data("data/employfinal.csv");
                    viz.y({ "value": "College" })
                    jQuery("#alert").removeClass("alert");
                    jQuery("#alert2").removeClass("alert");
                    viz.text({ "value": "College" }).draw();
                } else if (value == "Undergraduate") {
                    viz.data("data/employfinal.csv");
                    viz.y({ "value": "Undergraduate" })
                    jQuery("#alert").removeClass("alert");
                    jQuery("#alert2").addClass("alert");
                    viz.text({ "value": "Undergraduate" }).draw();
                } else {
                    viz.data("data/employfinal.csv");
                    viz.y({ "value": "Graduate" })
                    jQuery("#alert").addClass("alert");
                    viz.text({ "value": "Graduate" }).draw();
                }
            }
        }])
        .title("Percent of All Graduates Employed in Ohio")
        .title({
            "sub": "Within six months and within one year after graduation.",
            "total": false
        })
        .title({
            "font": {
                "family": "Montserrat, sans-serif",
                "size": 16,
                "transform": "uppercase"
            }
        })
        .tooltip({ "font": { "family": "Raleway, sans-serif" } })
        .tooltip(['value', 'Year'])
        .tooltip({ "sub": "notes" })
        .order({ "value": "Period" })
        .text("Undergraduate")
        .draw()


})

// Average Wages


var wages = d3plus.viz().container("#wages");
d3.csv("data/wages.csv", function(error, temp) {
    if (error) return console.error(error);
    console.log(temp);
    temp.forEach(function(d) {
        d3.keys(d).forEach(function(k) {
            if (k == "salary") {
                d[k] = +d[k]
            }
        })
    })
    wages
        .data(temp)
        .type("bar")
        .id("industry")
        .x({ 'value': 'industry', 'label': { 'font': { 'size': 12 } } })
        .y("salary")
        .font({
            "size": 12,
            "family": "Raleway, sans-serif"
        })

    .title({
            "sub": "Statewide",
            "total": false
        })
        .title({
            "font": {
                "family": "Montserrat, sans-serif",
                "size": 16,
                "transform": "uppercase"
            }
        })
        .tooltip({ "font": { "family": "Raleway, sans-serif" } })
        .order({ "value": "salary" })
        .text("industry")
        .format({
            'number': function(number, params) {

                return "$" + number.toLocaleString();
            }

        })
        .draw()
})