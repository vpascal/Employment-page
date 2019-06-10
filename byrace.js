var byrace = d3plus.viz().container("#byrace");
d3.csv("data/byrace.csv", function(error, temp) {
    if (error) return console.error(error);
    temp.forEach(function(d) {
        d3.keys(d).forEach(function(k) {
            if (k == "Percent") {
                d[k] = +d[k]
            }
        })
    })
    byrace
        .data(temp)
        .type("bar")
        .id("Race")
        .x({ 'value': 'Period', 'label': { 'font': { 'size': 16 } } })
        .y({ 'value': "Percent", 'range': [0, 100] })
        .time({ "value": "Year", "solo": 2016, 'fixed': true })
        .color({ 'value': 'Percent' })
        .font({
            "size": 14,
            "family": "Raleway, sans-serif"
        })
        .title("Percent of All Graduates Employed in Ohio: By Race")
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
        .order({ "value": "Period" })
        .text("Undergraduate")
        .draw()


})