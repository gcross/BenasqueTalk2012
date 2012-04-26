// Actors {{{
function makePunchLine() { // Punch line slide {{{
    var actor = new UseActor("punch_line")
    actor.top_set_node = document.getElementById("punch_line_top_set")
    actor.equals_node = document.getElementById("punch_line_equals")
    actor.bottom_set_nodes = document.getElementsByClassName("punch_line_bottom_set")

    actor.rational_power_series_node = document.getElementById("punch_line_rational_power_series")
    actor.s_operator_node = document.getElementById("punch_line_s_operator")
    actor.reverse_s_operator_node = document.getElementById("punch_line_reverse_s_operator")
    actor.dot_operator_node = document.getElementById("punch_line_dot_operator")

    actor.top_set_opacity = 0
    actor.equals_opacity = 0
    actor.bottom_set_opacity = 0

    actor.non_focused_opacity = 1
    actor.rational_power_series_opacity = 0
    actor.s_operator_opacity = 0
    actor.reverse_s_operator_opacity = 0
    actor.dot_operator_opacity = 0

    appendToMethod(actor,"update",function() {
        actor.top_set_node.setAttribute("opacity",actor.top_set_opacity*actor.non_focused_opacity)
        actor.equals_node.setAttribute("opacity",actor.equals_opacity*actor.non_focused_opacity)
        for(var i = 0; i < actor.bottom_set_nodes.length; ++i)
            actor.bottom_set_nodes[i].setAttribute("opacity",actor.bottom_set_opacity*actor.non_focused_opacity);
        if(actor.non_focused_opacity < 1) {
            ["rational_power_series","s_operator","reverse_s_operator","dot_operator"].forEach(function(label) {
                actor[label + "_node"].setAttribute("opacity",Math.max(
                    actor[label + "_node"].getAttribute("opacity"),
                    actor[label + "_opacity"]
                ))
            })
        }
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
        hire("punch_line",makePunchLine,"title_slide"),
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
        linear(0.5,"punch_line","non_focused_opacity",1),
        "",
    // }}}
// }}} Script
    ]))
},false)
