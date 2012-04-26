// Actors {{{
function makePunchLineActor() { // Punch line slide {{{
    var actor = new UseActor("punch_line")
    actor.top_set_node = document.getElementById("punch_line_top_set")
    actor.equals_node = document.getElementById("punch_line_equals")
    actor.bottom_set_nodes = document.getElementsByClassName("punch_line_bottom_set")

    actor.rational_power_series_node = document.getElementById("punch_line_rational_power_series")
    actor.s_operator_node = document.getElementById("punch_line_s_operator")
    actor.reverse_s_operator_node = document.getElementById("punch_line_reverse_s_operator")
    actor.dot_operator_node = document.getElementById("punch_line_dot_operator")
    actor.sum_operator_node = document.getElementById("punch_line_sum_operator")

    actor.top_set_opacity = 0
    actor.equals_opacity = 0
    actor.bottom_set_opacity = 0

    actor.non_focused_opacity = 1
    actor.rational_power_series_opacity = 0
    actor.s_operator_opacity = 0
    actor.reverse_s_operator_opacity = 0
    actor.dot_operator_opacity = 0
    actor.sum_operator_opacity = 0

    appendToMethod(actor,"update",function() {
        actor.top_set_node.setAttribute("opacity",actor.top_set_opacity*actor.non_focused_opacity)
        actor.equals_node.setAttribute("opacity",actor.equals_opacity*actor.non_focused_opacity)
        for(var i = 0; i < actor.bottom_set_nodes.length; ++i)
            actor.bottom_set_nodes[i].setAttribute("opacity",actor.bottom_set_opacity*actor.non_focused_opacity);
        if(actor.non_focused_opacity < 1) {
            ["rational_power_series",
             "s_operator",
             "reverse_s_operator",
             "dot_operator",
             "sum_operator",
            ].forEach(function(label) {
                actor[label + "_node"].setAttribute("opacity",Math.max(
                    actor[label + "_node"].getAttribute("opacity"),
                    actor[label + "_opacity"]
                ))
            })
        }
    })

    return actor
} // }}}
function makeOutlineActor() { // Outline slide {{{
    var actor = new UseActor("outline")

    var labels = [
        "languages",
        "weighted_languages",
        "weighted_languages_in_arrow",
        "weighted_languages_out_arrow",
        "infinite_languages",
        "infinite_languages_in_arrow",
        "infinite_languages_out_arrow",
        "infinite_weighted_languages",
        "escape_divergence",
        "escape_divergence_in_arrow",
        "embrace_divergence",
        "embrace_divergence_in_arrow",
        "embrace_divergence_out_arrow",
        "infinite_matrix_product_states"
    ]

    var nodes = {}
    var opacities = {}
    labels.forEach(function(label) {
        nodes[label] = document.getElementById("outline_" + label)
        if(!nodes[label]) throw Error("unable to find an node with id '" + "outline_" + label + "'")
        actor[label + "_opacity"] = 0
    })

    actor.non_focused_opacity = 1

    appendToMethod(actor,"update",function() {
        labels.forEach(function(label) {
            nodes[label].setAttribute("opacity",Math.max(
                actor.non_focused_opacity,
                actor[label + "_opacity"]
            ))
        })
    })

    return actor
} // }}}
// }}} Actors

// Title Management {{{
var current_title_index = -1

function nextTitleIndex() { // {{{
    current_title_index += 1
    return current_title_index
} // }}}
function rotateNextTitle() { // {{{
    return rotateTitle(nextTitleIndex())
} // }}}
function rotateTitle(index) { // {{{
    return sequence(
        parallel(
            accelerate(0.25,titles[index-1],"y",-50),
            fadeOutAndFire(0.25,titles[index-1])
        ),
        hireUseActor(titles[index]),
        set(titles[index],"y",-50),
        parallel(
            decelerate(0.25,titles[index],"y",0),
            fadeIn(0.25,titles[index])
        )
    )
} // }}}
// }}}
var titles = [ // Titles {{{
    "The Punch Line",
    "Outline",
] // }}} Titles

window.addEventListener("load",function() {
    // Initialization {{{
    (function() {
        var resources = document.getElementById("resources")
        var title_template = document.getElementById("title_template")
        for(var i = 0; i < titles.length; ++i) {
            var title = titles[i]
            var node = title_template.cloneNode(false)
            node.setAttribute("id",title)
            node.appendChild(document.createTextNode(title))
            resources.appendChild(node)
        }
    })()
    // }}} Initialization

    initializeSlick([].concat([
// Script {{{
    // Title {{{
        hire("title_slide"),
        "",
    // }}} Title
    // Punch line (first appearance) {{{
        hire("standard_backdrop",default_value,"title_slide"),
        hire(titles[nextTitleIndex()],default_value,"title_slide"),
        hire("punch_line",makePunchLineActor,"title_slide"),
        fadeOutAndFire(1,"title_slide"),
        "",
        linear(1,"punch_line","top_set_opacity",1),
        "",
        linear(1,"punch_line","equals_opacity",1),
        "",
        linear(1,"punch_line","bottom_set_opacity",1),
        "",
        set("punch_line","rational_power_series_opacity",1),
        linear(0.5,"punch_line","non_focused_opacity",0.25),
        "",
        parallel(
            linear(0.5,"punch_line","rational_power_series_opacity",1,0.25),
            linear(0.5,"punch_line","s_operator_opacity",0.25,1)
        ),
        "",
        parallel(
            linear(0.5,"punch_line","s_operator_opacity",1,0.25),
            linear(0.5,"punch_line","reverse_s_operator_opacity",0.25,1)
        ),
        "",
        parallel(
            linear(0.5,"punch_line","reverse_s_operator_opacity",1,0.25),
            linear(0.5,"punch_line","dot_operator_opacity",0.25,1)
        ),
        "",
        parallel(
            linear(0.5,"punch_line","dot_operator_opacity",1,0.25),
            linear(0.5,"punch_line","sum_operator_opacity",0.25,1)
        ),
        "",
        linear(0.5,"punch_line","non_focused_opacity",1),
        "",
    // }}}
    // Outline {{{
        rotateNextTitle(),
        fadeOutAndFire(0.5,"punch_line"),
        hireAndFadeIn(0.5,"outline",makeOutlineActor),
        "",
        set("outline","languages_opacity",1),
        linear(0.5,"outline","non_focused_opacity",0.15),
        "",
        parallel(
            linear(0.5,"outline","languages_opacity",0.5),
            linear(0.5,"outline","weighted_languages_opacity",1),
            linear(0.5,"outline","weighted_languages_in_arrow_opacity",1),
            linear(0.5,"outline","infinite_languages_opacity",1),
            linear(0.5,"outline","infinite_languages_in_arrow_opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","weighted_languages_opacity",0.5),
            linear(0.5,"outline","weighted_languages_in_arrow_opacity",0.5),
            linear(0.5,"outline","infinite_languages_opacity",0.5),
            linear(0.5,"outline","infinite_languages_in_arrow_opacity",0.5),
            linear(0.5,"outline","infinite_languages_out_arrow_opacity",1),
            linear(0.5,"outline","weighted_languages_out_arrow_opacity",1),
            linear(0.5,"outline","infinite_weighted_languages_opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","infinite_languages_out_arrow_opacity",0.5),
            linear(0.5,"outline","weighted_languages_out_arrow_opacity",0.5),
            linear(0.5,"outline","infinite_weighted_languages_opacity",0.5),
            linear(0.5,"outline","escape_divergence_opacity",1),
            linear(0.5,"outline","escape_divergence_in_arrow_opacity",1),
            linear(0.5,"outline","embrace_divergence_opacity",1),
            linear(0.5,"outline","embrace_divergence_in_arrow_opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","escape_divergence_opacity",0.5),
            linear(0.5,"outline","escape_divergence_in_arrow_opacity",0.5),
            linear(0.5,"outline","embrace_divergence_opacity",0.5),
            linear(0.5,"outline","embrace_divergence_in_arrow_opacity",0.5),
            linear(0.5,"outline","embrace_divergence_out_arrow_opacity",1),
            linear(0.5,"outline","infinite_matrix_product_states_opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","languages_opacity",1),
            linear(0.5,"outline","weighted_languages_opacity",0),
            linear(0.5,"outline","weighted_languages_in_arrow_opacity",0),
            linear(0.5,"outline","infinite_languages_opacity",0),
            linear(0.5,"outline","infinite_languages_in_arrow_opacity",0),
            linear(0.5,"outline","infinite_languages_out_arrow_opacity",0),
            linear(0.5,"outline","weighted_languages_out_arrow_opacity",0),
            linear(0.5,"outline","infinite_weighted_languages_opacity",0),
            linear(0.5,"outline","escape_divergence_opacity",0),
            linear(0.5,"outline","escape_divergence_in_arrow_opacity",0),
            linear(0.5,"outline","embrace_divergence_opacity",0),
            linear(0.5,"outline","embrace_divergence_in_arrow_opacity",0),
            linear(0.5,"outline","embrace_divergence_out_arrow_opacity",0),
            linear(0.5,"outline","infinite_matrix_product_states_opacity",0)
        ),
    // }}}
// }}} Script
    ]))
},false)
