// Functions {{{
function hireAndFlashIn(time_to_enter,time_between_starts) { // {{{
    animations = []
    var current_wait_time = 0
    for(var i = 2; i < arguments.length; ++i) {
        animations.push(sequence(
            wait(current_wait_time),
            hireAndFadeIn(time_to_enter,arguments[i])
        ))
        current_wait_time += time_between_starts
    }
    return parallel.apply(null,animations)
} // }}}
function makePartFocusActor(name,labels) { return function() { // {{{
    var actor = new UseActor(name)

    var nodes = {}
    labels.forEach(function(label) {
        nodes[label] = document.getElementById(name + "." + label)
        if(!nodes[label]) throw Error("unable to find an node with id '" + name + "." + label + "'")
        actor[label + ".opacity"] = 0
    })
    actor.nodes = nodes

    actor.non_focused_opacity = 1

    appendToMethod(actor,"update",function() {
        labels.forEach(function(label) {
            nodes[label].setAttribute("opacity",Math.max(
                actor.non_focused_opacity,
                actor[label + ".opacity"]
            ))
        })
    })

    return actor
}} // }}}
// }}}

// Actors {{{
function makePunchLineActor() { // Punch line slide {{{
    var actor = new UseActor("punch_line")
    actor.top_set_node = document.getElementById("punch_line_top_set")
    actor.equals_node = document.getElementById("punch_line_equals")
    actor.bottom_set_nodes = document.getElementsByClassName("punch_line_bottom_set")

    var labels = [
        "rational_power_series",
        "s_operator",
        "reverse_s_operator",
        "dot_operators",
        "sum_operator"
    ]

    var nodes = {}
    var opacities = {}
    labels = labels.map(function(label) {
        if(typeof label === "string") {
            node = document.getElementById("punch_line_" + label)
            if(!node)
                throw Error("unable to find a node with id '" + "punch_line_" + label + "'")
            nodes[label] = [node]
        } else {
            label = label[0]
            nodelist = document.getElementsByClassName("punch_line_" + label)
            if(nodelist.length = 0)
                throw Error("unable to find any nodes with class '" + "punch_line_" + label + "'")
            nodes[label] = Array(nodelist.length)
            for(var i = 0; i < nodelist.length; ++i) nodes[label][i] = nodelist[i];
        }
        actor[label + "_opacity"] = 0
        return label
    })
    actor.nodes = nodes
    actor.opacities = opacities

    actor.top_set_opacity = 0
    actor.equals_opacity = 0
    actor.bottom_set_opacity = 0

    actor.non_focused_opacity = 1

    appendToMethod(actor,"update",function() {
        actor.top_set_node.setAttribute("opacity",actor.top_set_opacity*actor.non_focused_opacity)
        actor.equals_node.setAttribute("opacity",actor.equals_opacity*actor.non_focused_opacity)
        for(var i = 0; i < actor.bottom_set_nodes.length; ++i)
            actor.bottom_set_nodes[i].setAttribute("opacity",actor.bottom_set_opacity*actor.non_focused_opacity);
        labels.forEach(function(label) {
            actor.nodes[label].forEach(function(node) { node.setAttribute("opacity",Math.max(
                node.getAttribute("opacity"),
                actor[label + "_opacity"]
            ))})
        })
    })

    return actor
} // }}}
function makeDivergingAutomataActor() { return function() { //
    actor = makePartFocusActor("diverging_automata.automata",[
        "final_weights.1",
        "final_weights.2",
        "state.1",
        "state.2",
        "transitions",
        "transitions.initial",
    ])()
    actor["final_weights.1.opacity_override"] = 1
    actor["final_weights.2.opacity_override"] = 1
    appendToMethod(actor,"update",function() {
        for(i = 1; i <= 2; ++i) {
            label = "final_weights." + i
            node = actor.nodes[label]
            node.setAttribute("opacity",actor[label + ".opacity_override"]*node.getAttribute("opacity"))
        }
    })
    return actor
}}
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
    "Matrix Product States",
    "Weighted Automata",
    "Matrix Product States = Weighted Automata",
    "Kleene's Theorem",
    "Language",
    "Weighted Language",
    "Rational Operations for Weighted Languages",
    "Kleene's Theorem",
    "Infinite Matrix Product States",
    "Diverging Automata",
    "Infinite Languages",
    "Rational Operations for Infinite Languages",
    "Bucchi (Infinite) Automata",
    "Kleen's Theorem for Infinite Languages",
    "Characterization Theorem for Infinite Languages",
    "Outline",
    "Diverging Languages",
    "Rational Operations for Diverging Languages",
    "Kleen's Theorem for Diverging Languages",
    "Characterization Theorem for Diverging Languages",
    "Bidiverging Languages",
    "Bidiverging Automata",
    "Kleen's Theorem for Bidiverging Languages",
    "Characterization Theorem for Bidiverging Languages",
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
        fadeOutAndFire(1,"title_slide"),
        hireAndFadeInUseActors(0.5,
            "standard_backdrop",
            titles[nextTitleIndex()]
        ),
        parallel(
            hireAndFadeIn(0.5,"punch_line_top_set"),
            sequence(
                wait(0.25),
                hireAndFadeIn(0.5,"punch_line_equals")
            ),
            sequence(
                wait(0.5),
                hireAndFadeIn(0.5,"punch_line_bottom_set",makePartFocusActor("punch_line_bottom_set",[
                    "delta_operators",
                    "dot_operators",
                    "sum_operator",
                    "juxtaposition_operator",
                    "rational"
                ]))
            )
        ),
        "",
/*
        set("punch_line_bottom_set","rational.opacity",1),
        linear(0.5,"punch_line_bottom_set","non_focused_opacity",0.25),
        "",
        parallel(
            linear(0.5,"punch_line","rational_power_series.opacity",0.25),
            linear(0.5,"punch_line","delta_operators_opacity",0.25)
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
*/
        fadeOutAndFire(0.5,
            "punch_line_top_set",
            "punch_line_equals",
            "punch_line_bottom_set"
        ),
    // }}}
  // Finite system {{{
    // Matrix product states{{{
        rotateNextTitle(),
        hireAndFadeInUseActors(0.5,"mps.definition","mps.wave_function.abstract"),
        "",
        parallel(
            fadeOutAndFire(0.5, "mps.wave_function.abstract"),
            hireAndFadeInUseActor(0.5, "mps.wave_function.concrete")
        ),
        "",
        fadeOutAndFire(0.5,
            "mps.definition",
            "mps.wave_function.concrete"
        ),
    // }}}
    // Weighted automata {{{
        rotateNextTitle(),
      // Introduce the automata {{{
        hireUseActors("weighted_automata.5tuple","weighted_automata.5tuple.cover"),
        linear(0.5,"weighted_automata.5tuple.cover","x",470),
        hireAndFlashIn(0.5,0.25,
            "weighted_automata.5tuple.alphabet",
            "weighted_automata.5tuple.states",
            "weighted_automata.5tuple.transitions",
            "weighted_automata.5tuple.initial",
            "weighted_automata.5tuple.final"
        ),
        "",
        hire("weighted_automata.automata",makePartFocusActor("weighted_automata.automata",[
            "final_weights.1",
            "final_weights.2",
            "state.1",
            "state.2",
            "transitions",
            "transitions.initial",
        ])),
        parallel(
            decelerate(1,"weighted_automata.automata","x",520,0),
            hireAndFadeInUseActor(1,"weighted_automata.automata.box")
        ),
        "",
        parallel(
            linear(0.5,styleFor("weighted_automata.5tuple.states"),"opacity",0.33),
            linear(0.5,styleFor("weighted_automata.5tuple.transitions"),"opacity",0.33),
            linear(0.5,styleFor("weighted_automata.5tuple.initial"),"opacity",0.33),
            linear(0.5,styleFor("weighted_automata.5tuple.final"),"opacity",0.33),
            linear(0.5,"weighted_automata.automata","non_focused_opacity",0.33)
        ),
        "",
        parallel(
            linear(0.5,styleFor("weighted_automata.5tuple.alphabet"),"opacity",0.33),
            linear(0.5,styleFor("weighted_automata.5tuple.states"),"opacity",1),
            linear(0.5,"weighted_automata.automata","state.2.opacity",1),
            linear(0.5,"weighted_automata.automata","state.1.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("weighted_automata.5tuple.states"),"opacity",0.33),
            linear(0.5,styleFor("weighted_automata.5tuple.transitions"),"opacity",1),
            linear(0.5,"weighted_automata.automata","state.1.opacity",0.33),
            linear(0.5,"weighted_automata.automata","state.2.opacity",0.33),
            linear(0.5,"weighted_automata.automata","transitions.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("weighted_automata.5tuple.transitions"),"opacity",0.33),
            linear(0.5,styleFor("weighted_automata.5tuple.initial"),"opacity",1),
            linear(0.5,"weighted_automata.automata","transitions.opacity",0.33),
            linear(0.5,"weighted_automata.automata","state.1.opacity",1),
            linear(0.5,"weighted_automata.automata","transitions.initial.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("weighted_automata.5tuple.initial"),"opacity",0.33),
            linear(0.5,styleFor("weighted_automata.5tuple.final"),"opacity",1),
            linear(0.5,"weighted_automata.automata","transitions.initial.opacity",0.33),
            linear(0.5,"weighted_automata.automata","state.2.opacity",1),
            linear(0.5,"weighted_automata.automata","final_weights.1.opacity",1),
            linear(0.5,"weighted_automata.automata","final_weights.2.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"weighted_automata.automata","non_focused_opacity",1),
            linear(0.5,styleFor("weighted_automata.5tuple.alphabet"),"opacity",1),
            linear(0.5,styleFor("weighted_automata.5tuple.states"),"opacity",1),
            linear(0.5,styleFor("weighted_automata.5tuple.transitions"),"opacity",1),
            linear(0.5,styleFor("weighted_automata.5tuple.initial"),"opacity",1),
            linear(0.5,styleFor("weighted_automata.5tuple.final"),"opacity",1)
        ),
        set("weighted_automata.automata","state.1.opacity",0),
        set("weighted_automata.automata","state.2.opacity",0),
        set("weighted_automata.automata","final_weights.1.opacity",0),
        set("weighted_automata.automata","final_weights.2.opacity",0),
        hireAndFadeIn(1,"weighted_automata.criterion"),
      // }}}
      // First example {{{
        "",
        hireAndFlashIn(0.5,0.25,
            "weighted_automata.input.1.0",
            "weighted_automata.input.2.0",
            "weighted_automata.input.3.1",
            "weighted_automata.input.4.0"
        ),
        "",
        hireAndFadeIn(0.5,"weighted_automata.weight"),
        "",
        hireAndFadeIn(0.5,"weighted_automata.marker",null,"weighted_automata.automata"),
        smooth(0.5,"weighted_automata.marker","x",124.169),
        "",
        hireAndFadeIn(0.5,"weighted_automata.reader"),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",210.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",124.169),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeIn(0.5,"weighted_automata.weight.1.1_2")
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",106),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",210.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",124.169),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeInUseActors(0.5,
                "weighted_automata.weight.2.1_2",
                "weighted_automata.weight.dot.1"
            )
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",212),
        "",
        parallel(
            smooth(0.5,"weighted_automata.marker","x",336.694),
            hireAndFadeInUseActors(0.5,
                "weighted_automata.weight.3.1",
                "weighted_automata.weight.dot.2"
            )
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",318),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",444.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",336.694),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeInUseActors(0.5,
                "weighted_automata.weight.4.1_",
                "weighted_automata.weight.4._3",
                "weighted_automata.weight.dot.3"
            )
        ),
        "",
        fadeOut(0.5,"weighted_automata.reader"),
        "",
        set("weighted_automata.automata","state.2.opacity",1),
        set("weighted_automata.automata","final_weights.2.opacity",1),
        linear(0.5,"weighted_automata.automata","non_focused_opacity",0.25),
        "",
        hireAndFadeInUseActors(0.5,
            "weighted_automata.weight.final.1",
            "weighted_automata.weight.dot.4"
        ),
        "",
        linear(0.5,"weighted_automata.automata","non_focused_opacity",1),
        set("weighted_automata.automata","state.2.opacity",0),
        set("weighted_automata.automata","final_weights.2.opacity",0),
        "",
        hireAndFadeInUseActors(0.5,
            "weighted_automata.weight.equals",
            "weighted_automata.weight.result.1_12"
        ),
        "",
      // }}}
      // Second example {{{
        "",
        fadeOutAndFire(0.25,"weighted_automata.input.2.0"),
        hireAndFadeIn(0.25,"weighted_automata.input.2.1"),
        fadeOutAndFire(0.5,
            "weighted_automata.weight.1.1_2",
            "weighted_automata.weight.2.1_2",
            "weighted_automata.weight.dot.1",
            "weighted_automata.weight.3.1",
            "weighted_automata.weight.dot.2",
            "weighted_automata.weight.4.1_",
            "weighted_automata.weight.4._3",
            "weighted_automata.weight.dot.3",
            "weighted_automata.weight.final.1",
            "weighted_automata.weight.dot.4",
            "weighted_automata.weight.equals",
            "weighted_automata.weight.result.1_12"
        ),
        smooth(0.5,"weighted_automata.marker","x",124.169),
        "",
        set("weighted_automata.reader","x",0),
        fadeIn(0.5,"weighted_automata.reader"),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",210.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",124.169),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.1.1_2")
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",106),
        "",
        parallel(
            smooth(0.5,"weighted_automata.marker","x",336.694),
            hireAndFadeInUseActors(0.5,
                "weighted_automata.weight.2.1",
                "weighted_automata.weight.dot.1"
            )
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",212),
        "",
        parallel(
            sequence(
                linear(0.025,"weighted_automata.automata","x",20),
                linear(0.05,"weighted_automata.automata","x",-20),
                linear(0.05,"weighted_automata.automata","x",20),
                linear(0.05,"weighted_automata.automata","x",-20),
                linear(0.025,"weighted_automata.automata","x",0)
            ),
            sequence(
                linear(0.025,"weighted_automata.automata","y",10),
                linear(0.05,"weighted_automata.automata","y",-10),
                linear(0.05,"weighted_automata.automata","y",10),
                linear(0.05,"weighted_automata.automata","y",-10),
                linear(0.05,"weighted_automata.automata","y",10),
                linear(0.05,"weighted_automata.automata","y",-10),
                linear(0.025,"weighted_automata.automata","y",0)
            )
        ),
        "",
        fadeOut(0.5,"weighted_automata.reader"),
        hireAndFadeInUseActors(0.5,
            "weighted_automata.weight.3.0",
            "weighted_automata.weight.dot.2",
            "weighted_automata.weight.equals",
            "weighted_automata.weight.result.0"
        ),
      // }}}
      // Third example {{{
        "",
        parallel(
            sequence(
                fadeOutAndFire(0.25,"weighted_automata.input.2.1"),
                hireAndFadeIn(0.25,"weighted_automata.input.2.0")
            ),
            sequence(
                wait(0.125),
                fadeOutAndFire(0.25,"weighted_automata.input.3.1"),
                hireAndFadeIn(0.25,"weighted_automata.input.3.0")
            )
        ),
        fadeOutAndFire(0.5,
            "weighted_automata.weight.1.1_2",
            "weighted_automata.weight.2.1",
            "weighted_automata.weight.dot.1",
            "weighted_automata.weight.3.0",
            "weighted_automata.weight.dot.2",
            "weighted_automata.weight.equals",
            "weighted_automata.weight.result.0"
        ),
        "",
        smooth(0.5,"weighted_automata.marker","x",124.169),
        "",
        set("weighted_automata.reader","x",0),
        fadeIn(0.5,"weighted_automata.reader"),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",210.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",124.169),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.1.1_2")
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",106),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",210.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",124.169),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.dot.1"),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.2.1_2")
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",212),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",210.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",124.169),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.dot.2"),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.3.1_2")
        ),
        "",
        smooth(0.5,"weighted_automata.reader","x",318),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"weighted_automata.marker","x",210.128),
                    accelerate(0.25,"weighted_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"weighted_automata.marker","x",124.169),
                    decelerate(0.25,"weighted_automata.marker","y",0)
                )
            ),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.dot.3"),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.4.1_"),
            hireAndFadeInUseActor(0.5,"weighted_automata.weight.4._2")
        ),
        "",
        fadeOut(0.5,"weighted_automata.reader"),
        "",
        set("weighted_automata.automata","state.1.opacity",1),
        set("weighted_automata.automata","final_weights.1.opacity",1),
        linear(0.5,"weighted_automata.automata","non_focused_opacity",0.25),
        "",
        hireAndFadeInUseActors(0.5,
            "weighted_automata.weight.dot.4",
            "weighted_automata.weight.final.0",
            "weighted_automata.weight.equals",
            "weighted_automata.weight.result.0"
        ),
        "",
        linear(0.5,"weighted_automata.automata","non_focused_opacity",1),
        "",
      // }}}
      // Fade out everything {{{
        fadeOutAndFire(0.5,
            "weighted_automata.automata",
            "weighted_automata.automata.box",
            "weighted_automata.marker",
            "weighted_automata.criterion",
            "weighted_automata.5tuple",
            "weighted_automata.5tuple.cover",
            "weighted_automata.5tuple.alphabet",
            "weighted_automata.5tuple.states",
            "weighted_automata.5tuple.transitions",
            "weighted_automata.5tuple.initial",
            "weighted_automata.5tuple.final",
            "weighted_automata.input.1.0",
            "weighted_automata.input.2.0",
            "weighted_automata.input.3.0",
            "weighted_automata.input.4.0",
            "weighted_automata.weight",
            "weighted_automata.weight.1.1_2",
            "weighted_automata.weight.2.1_2",
            "weighted_automata.weight.3.1_2",
            "weighted_automata.weight.4.1_",
            "weighted_automata.weight.4._2",
            "weighted_automata.weight.dot.1",
            "weighted_automata.weight.dot.2",
            "weighted_automata.weight.dot.3",
            "weighted_automata.weight.dot.4",
            "weighted_automata.weight.final.0",
            "weighted_automata.weight.equals",
            "weighted_automata.weight.result.0"
        ),
      // }}}
    // }}}
    // Connect automata to MPS {{{
        rotateNextTitle(),
        hireAndFadeIn(0.5,"mac.mps"),
        "",
        hireAndFlashIn(0.5,0.25,
            "mac.mps.1",
            "mac.mps.2",
            "mac.mps.3",
            "mac.mps.rest"
        ),
        "",
        hireAndFadeInUseActors(0.5,
            "mac.walk.1",
            "mac.indices.1"
        ),
        "",
        parallel(
            linear(0.5,styleFor("mac.walk.1"),"opacity",0.5),
            fadeOutAndFire(0.5,"mac.indices.1"),
            hireAndFadeInUseActors(0.5,
                "mac.walk.2",
                "mac.indices.2"
            )
        ),
        "",
        parallel(
            linear(0.5,styleFor("mac.walk.2"),"opacity",0.5),
            fadeOutAndFire(0.5,"mac.indices.2"),
            hireAndFadeInUseActors(0.5,
                "mac.walk.3",
                "mac.indices.3"
            )
        ),
        "",
        parallel(
            fadeOutAndFire(0.5,"mac.indices.3"),
            linear(0.5,styleFor("mac.walk.1"),"opacity",1),
            linear(0.5,styleFor("mac.walk.2"),"opacity",1)
        ),
        "",
        fadeOutAndFire(0.5,
            "mac.mps",
            "mac.mps.1",
            "mac.mps.2",
            "mac.mps.3",
            "mac.mps.rest",
            "mac.walk.1",
            "mac.walk.2",
            "mac.walk.3"
        ),
    // }}}
    // Kleene's Theorem {{{
        rotateNextTitle(),
        hireAndFlashIn(0.75,0.375,
            "weighted_kleene1",
            "weighted_kleene2",
            "weighted_kleene3"
        ),
        "",
        fadeOutAndFire(0.5,"weighted_kleene1"),
        hireAndFadeIn(0.5,"weighted_kleene4"),
        "",
        fadeOutAndFire(0.5,
            "weighted_kleene4",
            "weighted_kleene2",
            "weighted_kleene3"
        ),
    // }}}
    // Languages {{{
        rotateNextTitle(),
        hireAndFadeIn(0.5,"languages.borderlines"),
        "",
        hireAndFadeIn(1,"languages.alphabet"),
        "",
        hireAndFlashIn(0.5,0.25,
            "languages.alphabet.example1",
            "languages.alphabet.example2"
        ),
        "",
        hireAndFadeIn(1,"languages.word"),
        "",
        linear(0.5,styleFor("languages.alphabet.example2"),"opacity",0.25),
        hireAndFlashIn(0.5,0.1,
            "languages.word.example1a",
            "languages.word.example1b",
            "languages.word.example1c"
        ),
        "",
        parallel(
            linear(0.5,styleFor("languages.alphabet.example1"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example1a"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example1b"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example1c"),"opacity",0.25)
        ),
        linear(0.5,styleFor("languages.alphabet.example2"),"opacity",1),
        hireAndFlashIn(0.5,0.1,
            "languages.word.example2a",
            "languages.word.example2b",
            "languages.word.example2c"
        ),
        "",
        parallel(
            linear(0.5,styleFor("languages.alphabet.example1"),"opacity",1),
            linear(0.5,styleFor("languages.word.example1a"),"opacity",1),
            linear(0.5,styleFor("languages.word.example1b"),"opacity",1),
            linear(0.5,styleFor("languages.word.example1c"),"opacity",1)
        ),
        wait(0.5),
        hireAndFadeIn(0.5,"languages.language"),
        "",
        parallel(
            linear(0.5,styleFor("languages.alphabet.example2"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example2a"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example2b"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example2c"),"opacity",0.25)
        ),
        hireAndFlashIn(0.5,0.1,
            "languages.language.example1a",
            "languages.language.example1b",
            "languages.language.example1c"
        ),
        "",
        parallel(
            linear(0.5,styleFor("languages.alphabet.example1"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example1a"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example1b"),"opacity",0.25),
            linear(0.5,styleFor("languages.word.example1c"),"opacity",0.25),
            linear(0.5,styleFor("languages.language.example1a"),"opacity",0.25),
            linear(0.5,styleFor("languages.language.example1b"),"opacity",0.25),
            linear(0.5,styleFor("languages.language.example1c"),"opacity",0.25)
        ),
        parallel(
            linear(0.5,styleFor("languages.alphabet.example2"),"opacity",1),
            linear(0.5,styleFor("languages.word.example2a"),"opacity",1),
            linear(0.5,styleFor("languages.word.example2b"),"opacity",1),
            linear(0.5,styleFor("languages.word.example2c"),"opacity",1)
        ),
        hireAndFlashIn(0.5,0.1,
            "languages.language.example2a",
            "languages.language.example2b",
            "languages.language.example2c"
        ),
        "",
        parallel(
            linear(0.5,styleFor("languages.alphabet.example1"),"opacity",1),
            linear(0.5,styleFor("languages.word.example1a"),"opacity",1),
            linear(0.5,styleFor("languages.word.example1b"),"opacity",1),
            linear(0.5,styleFor("languages.word.example1c"),"opacity",1),
            linear(0.5,styleFor("languages.language.example1a"),"opacity",1),
            linear(0.5,styleFor("languages.language.example1b"),"opacity",1),
            linear(0.5,styleFor("languages.language.example1c"),"opacity",1)
        ),
        "",
        fadeOutAndFire(0.5,
            "languages.borderlines",
            "languages.alphabet",
            "languages.alphabet.example1",
            "languages.alphabet.example2",
            "languages.word",
            "languages.word.example1a",
            "languages.word.example1b",
            "languages.word.example1c",
            "languages.word.example2a",
            "languages.word.example2b",
            "languages.word.example2c",
            "languages.language",
            "languages.language.example1a",
            "languages.language.example1b",
            "languages.language.example1c",
            "languages.language.example2a",
            "languages.language.example2b",
            "languages.language.example2c"
        ),
    // }}}
    // Weighted language {{{
        rotateNextTitle(),
        hireAndFadeIn(0.5,"weighted_languages.borderlines"),
        "",
        hireAndFadeIn(0.5,"weighted_languages.alphabet"),
        "",
        hireAndFadeIn(0.5,"weighted_languages.alphabet.example"),
        "",
        hireAndFadeIn(0.5,"weighted_languages.semiring.1"),
        "",
        hireAndFadeIn(0.5,"weighted_languages.semiring.2"),
        "",
        hireAndFadeIn(0.5,"weighted_languages.semiring.example"),
        "",
        hireAndFadeIn(0.5,"weighted_languages.word"),
        "",
        hireAndFlashIn(0.5,0.25,
            "weighted_languages.word.example1",
            "weighted_languages.word.example2",
            "weighted_languages.word.example3"
        ),
        "",
        hireAndFadeIn(0.5,"weighted_languages.language"),
        "",
        hireAndFlashIn(0.5,0.25,
            "weighted_languages.language.example1",
            "weighted_languages.language.example2",
            "weighted_languages.language.example3"
        ),
        "",
        fadeOutAndFire(0.5,
            "weighted_languages.alphabet",
            "weighted_languages.alphabet.example",
            "weighted_languages.borderlines",
            "weighted_languages.language",
            "weighted_languages.language.example1",
            "weighted_languages.language.example2",
            "weighted_languages.language.example3",
            "weighted_languages.semiring.1",
            "weighted_languages.semiring.2",
            "weighted_languages.semiring.example",
            "weighted_languages.word",
            "weighted_languages.word.example1",
            "weighted_languages.word.example2",
            "weighted_languages.word.example3"
        ),
    // }}}
    // Rational weighted operations {{{
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "weighted_rational_operations_box_1",
            "weighted_rational_operations_box_2",
            "weighted_rational_operations_box_3"
        ),
        "",
        hireAndFadeInUseActor(0.5, "weighted_rational_operations_definition_1"),
        "",
        hireAndFadeIn(0.5,"weighted_rational_operations_example_1"),
        "",
        hireAndFadeInUseActor(0.5, "weighted_rational_operations_definition_2"),
        "",
        hireAndFadeIn(0.5,"weighted_rational_operations_example_2"),
        "",
        hireAndFadeInUseActor(0.5, "weighted_rational_operations_definition_3"),
        "",
        hireAndFadeIn(0.5,"weighted_rational_operations_opdef_3_warning"),
        "",
        hireAndFadeIn(0.5,"weighted_rational_operations_example_3"),
        "",
        hireAndFadeIn(0.5,"weighted_rational_language_definition"),
        "",
        fadeOutAndFire(0.5,
            "weighted_rational_operations_box_1",
            "weighted_rational_operations_box_2",
            "weighted_rational_operations_box_3",
            "weighted_rational_operations_definition_1",
            "weighted_rational_operations_definition_2",
            "weighted_rational_operations_definition_3",
            "weighted_rational_operations_example_1",
            "weighted_rational_operations_example_2",
            "weighted_rational_operations_example_3",
            "weighted_rational_operations_opdef_3_warning",
            "weighted_rational_language_definition"
        ),
    // }}}
    // Kleene's Theorem (encore) {{{
        rotateNextTitle(),
        hireAndFlashIn(0.75,0.375,
            "weighted_kleene4",
            "weighted_kleene2",
            "weighted_kleene3"
        ),
        "",
        fadeOutAndFire(0.5,
            "weighted_kleene4",
            "weighted_kleene2",
            "weighted_kleene3"
        ),
    // }}}
  // }}}
  // Infinite system {{{
    // IMPS {{{
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "imps_justification.the_good.label",
            "imps_justification.the_bad.label",
            "imps_justification.the_beautiful.label"
        ),
        "",
        hireAndFadeIn(0.5,"imps_justification.the_good.text"),
        "",
        hireAndFadeIn(0.5,"imps_justification.the_bad.text"),
        "",
        hireAndFadeIn(0.5,"imps_justification.the_beautiful.text"),
        "",
        fadeOutAndFire(0.5,
            "imps_justification.the_good.label",
            "imps_justification.the_bad.label",
            "imps_justification.the_beautiful.label",
            "imps_justification.the_good.text",
            "imps_justification.the_bad.text",
            "imps_justification.the_beautiful.text"
        ),
        hireAndFadeIn(0.5,"divergence.backdrop"),
        "",
        hireAndFadeInUseActors(0.5,
            "divergence.line",
            "divergence.infinity"
        ),
        "",
        hireAndFadeIn(0.5,"divergence.function"),
        "",
        parallel(
            fadeOutAndFire(0.5,"divergence.line"),
            hireAndFadeIn(0.5,"divergence.curve")
        ),
        "",
        fadeOutAndFire(0.5,
            "divergence.backdrop",
            "divergence.curve",
            "divergence.infinity",
            "divergence.function"
        ),
    // }}}
  // Diverging automata {{{
        rotateNextTitle(),
      // Introduce the automata {{{
        hireUseActors("diverging_automata.5tuple","diverging_automata.5tuple.cover"),
        linear(0.5,"diverging_automata.5tuple.cover","x",470),
        hireAndFlashIn(0.5,0.25,
            "diverging_automata.5tuple.alphabet",
            "diverging_automata.5tuple.states",
            "diverging_automata.5tuple.transitions",
            "diverging_automata.5tuple.initial",
            "diverging_automata.5tuple.final"
        ),
        hire("diverging_automata.automata",makeDivergingAutomataActor()),
        parallel(
            decelerate(1,"diverging_automata.automata","x",520,0),
            hireAndFadeInUseActor(1,"diverging_automata.automata.box")
        ),
        "",
        hireAndFadeIn(1,"diverging_automata.criterion"),
      // }}}
    // First example {{{
        hireAndFlashIn(0.5,0.25,
            "diverging_automata.input.1.1",
            "diverging_automata.input.2.0",
            "diverging_automata.input.3.0",
            "diverging_automata.input.4plus"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.marker",null,"diverging_automata.automata"),
        smooth(0.5,"diverging_automata.marker","x",124.169),
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        "",
        smooth(0.5,"diverging_automata.marker","x",336.694),
        "",
        smooth(0.5,"diverging_automata.reader","x",106),
        "",
        parallel(
            accelerate(0.5,"diverging_automata.reader","x",500),
            parallel(
                wait(0.5),
                set("diverging_automata.automata","state.2.opacity",1),
                linear(0.75,"diverging_automata.automata","non_focused_opacity",0.33)
            ),
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",444.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",336.694),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.20,"diverging_automata.marker","x",444.128),
                    accelerate(0.20,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.20,"diverging_automata.marker","x",336.694),
                    decelerate(0.20,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.15,"diverging_automata.marker","x",444.128),
                    accelerate(0.15,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.15,"diverging_automata.marker","x",336.694),
                    decelerate(0.15,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                )
            )
        ),
        fire("diverging_automata.reader"),
        "",
        linear(0.5,"diverging_automata.automata","final_weights.2.opacity",1),
        "",
        parallel(
            linear(0.5,"diverging_automata.automata","non_focused_opacity",1),
            linear(0.5,"diverging_automata.automata","final_weights.1.opacity_override",0)
        ),
        set("diverging_automata.automata","state.2.opacity",0),
        "",
        smooth(0.5,"diverging_automata.marker","x",124.169),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_automata.weight.input.0",
            "diverging_automata.weight.mapsto"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.weight.1.0"),
        "",
        sequence(
            fadeOutAndFire(0.25,"diverging_automata.weight.input.0"),
            hireAndFadeIn(0.25,"diverging_automata.weight.input.1")
        ),
        fadeOutAndFire(0.5,"diverging_automata.weight.1.0"),
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        "",
        parallel(
            smooth(0.5,"diverging_automata.marker","x",336.694),
            hireAndFadeIn(0.25,"diverging_automata.weight.1.1")
        ),
        "",
        set("diverging_automata.automata","final_weights.2.opacity",1),
        linear(0.5,"diverging_automata.automata","non_focused_opacity",0.33),
        "",
        hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.equals",
                "diverging_automata.weight.result.1",
                "diverging_automata.weight.dot.3",
                "diverging_automata.weight.4.1"
        ),
        "",
        linear(0.5,"diverging_automata.automata","non_focused_opacity",1),
        set("diverging_automata.automata","final_weights.2.opacity",0),
        "",
        sequence(
            fadeOutAndFire(0.25,"diverging_automata.weight.input.1"),
            hireAndFadeIn(0.25,"diverging_automata.weight.input.2")
        ),
        "",
        smooth(0.5,"diverging_automata.reader","x",106),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",444.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",336.694),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                )
            ),
            fadeOutAndFire(0.25,"diverging_automata.weight.result.1"),
            hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.2.1_3",
                "diverging_automata.weight.dot.1",
                "diverging_automata.weight.result.1_3"
            )
        ),
        "",
        smooth(0.5,"diverging_automata.reader","x",212),
        "",
        parallel(
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",444.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",336.694),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                )
            ),
            fadeOutAndFire(0.25,"diverging_automata.weight.result.1_3"),
            hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.3.1_3",
                "diverging_automata.weight.dot.2",
                "diverging_automata.weight.result.1_9"
            )
        ),
        "",
        sequence(
            fadeOutAndFire(0.25,"diverging_automata.weight.input.2"),
            hireAndFadeIn(0.25,"diverging_automata.weight.input.n")
        ),
        "",
        parallel(
            fadeOutAndFire(0.25,
                "diverging_automata.weight.1.1",
                "diverging_automata.weight.2.1_3",
                "diverging_automata.weight.dot.1",
                "diverging_automata.weight.3.1_3",
                "diverging_automata.weight.dot.2",
                "diverging_automata.weight.4.1",
                "diverging_automata.weight.dot.3",
                "diverging_automata.weight.result.1_9"
            ),
            hireAndFadeInUseActors(0.5,
                "diverging_automata.weight.result.1_3",
                "diverging_automata.weight.result.to_the_n"
            ),
            accelerate(0.5,"diverging_automata.reader","x",500)
        ),
    // }}}
        "",
  // }}}
    // Infinite languages {{{
        rotateNextTitle(),
        hireAndFadeInUseActor(0.5,"infinite_languages.borderlines"),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.alphabet"),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.alphabet.example"),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.words.finite"),
        "",
        hireAndFlashIn(0.5,0.25,
            "infinite_languages.words.finite.examples.1",
            "infinite_languages.words.finite.examples.2"
        ),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.words.infinite"),
        "",
        hireAndFlashIn(0.5,0.25,
            "infinite_languages.words.infinite.examples.1",
            "infinite_languages.words.infinite.examples.2"
        ),
        "",
        hireAndFadeInUseActor(0.5,"infinite_languages.words.nfinite"),
        "",
        hireAndFlashIn(0.5,0.25,
            "infinite_languages.words.nfinite.examples.1",
            "infinite_languages.words.nfinite.examples.2"
        ),
        "",
        fadeOutAndFire(0.5,
            "infinite_languages.borderlines",
            "infinite_languages.alphabet",
            "infinite_languages.alphabet.example",
            "infinite_languages.words.finite",
            "infinite_languages.words.finite.examples.1",
            "infinite_languages.words.finite.examples.2",
            "infinite_languages.words.infinite",
            "infinite_languages.words.infinite.examples.1",
            "infinite_languages.words.infinite.examples.2",
            "infinite_languages.words.nfinite",
            "infinite_languages.words.nfinite.examples.1",
            "infinite_languages.words.nfinite.examples.2"
        ),

// }}}
    // Rational infinite operations {{{
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "infinite_rational_operations_box_1",
            "infinite_rational_operations_box_2"
        ),
        "",
        hireAndFadeInUseActor(0.5, "infinite_rational_operations_precondition_1"),
        "",
        hireAndFadeInUseActor(0.5, "infinite_rational_operations_definition_1"),
        "",
        hireAndFadeInUseActor(0.5, "infinite_rational_operations_precondition_2"),
        "",
        hireAndFadeInUseActor(0.5, "infinite_rational_operations_definition_2"),
        "",
        hireAndFadeInUseActor(0.5, "infinite_rational_operations_definition_3"),
        "",
        hireAndFadeInUseActor(0.5, "infinite_rational_operations_definition_4"),
        "",
        hireAndFadeIn(0.5,"infinite_rational_language_definition"),
        "",
        fadeOutAndFire(0.5,
            "infinite_rational_operations_box_1",
            "infinite_rational_operations_box_2",
            "infinite_rational_operations_precondition_1",
            "infinite_rational_operations_precondition_2",
            "infinite_rational_operations_definition_1",
            "infinite_rational_operations_definition_2",
            "infinite_rational_operations_definition_3",
            "infinite_rational_operations_definition_4",
            "infinite_rational_language_definition"
        ),
    // }}}
    // Infinite automata {{{
        rotateNextTitle(),
      // Introduce the automata {{{
        hireUseActors("diverging_automata.5tuple","diverging_automata.5tuple.cover"),
        "",
        linear(0.5,"diverging_automata.5tuple.cover","x",470),
        hireAndFlashIn(0.5,0.25,
            "diverging_automata.5tuple.alphabet",
            "diverging_automata.5tuple.states",
            "diverging_automata.5tuple.transitions",
            "diverging_automata.5tuple.initial",
            "diverging_automata.5tuple.final"
        ),
        hire("diverging_automata.automata",makePartFocusActor("diverging_automata.automata",[
            "state.1",
            "state.2",
            "transitions",
            "transitions.initial",
        ])),
        parallel(
            decelerate(1,"diverging_automata.automata","x",520,0),
            hireAndFadeInUseActor(1,"diverging_automata.automata.box")
        ),
        "",
        hireAndFadeIn(1,"diverging_automata.criterion"),
        "",
        hireAndFadeIn(1,"diverging_automata.criterion.highlight",null,"diverging_automata.criterion"),
      // }}}
      // First example {{{
        "",
        hireAndFlashIn(0.5,0.25,
            "diverging_automata.input.1.0",
            "diverging_automata.input.2",
            "diverging_automata.input.3",
            "diverging_automata.input.4plus"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.marker",null,"diverging_automata.automata"),
        smooth(0.5,"diverging_automata.marker","x",124.169),
        "",
        hireAndFadeIn(0.5,"diverging_automata.reader"),
        parallel(
            accelerate(0.25,"diverging_automata.marker","x",210.128),
            accelerate(0.25,"diverging_automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"diverging_automata.marker","x",124.169),
            decelerate(0.25,"diverging_automata.marker","y",0)
        ),
        smooth(0.5,"diverging_automata.reader","x",106),
        parallel(
            accelerate(0.25,"diverging_automata.marker","x",210.128),
            accelerate(0.25,"diverging_automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"diverging_automata.marker","x",124.169),
            decelerate(0.25,"diverging_automata.marker","y",0)
        ),
        smooth(0.5,"diverging_automata.reader","x",212),
        parallel(
            accelerate(0.25,"diverging_automata.marker","x",210.128),
            accelerate(0.25,"diverging_automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"diverging_automata.marker","x",124.169),
            decelerate(0.25,"diverging_automata.marker","y",0)
        ),
        parallel(
            accelerate(0.5,"diverging_automata.reader","x",500),
            parallel(
                wait(0.5),
                set("diverging_automata.automata","state.1.opacity",1),
                linear(0.75,"diverging_automata.automata","non_focused_opacity",0.33)
            ),
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",210.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",124.169),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.20,"diverging_automata.marker","x",210.128),
                    accelerate(0.20,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.20,"diverging_automata.marker","x",124.169),
                    decelerate(0.20,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.15,"diverging_automata.marker","x",210.128),
                    accelerate(0.15,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.15,"diverging_automata.marker","x",124.169),
                    decelerate(0.15,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",210.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",124.169),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                )
            )
        ),
        "",
        fire("diverging_automata.reader"),
        "",
        linear(0.75,"diverging_automata.automata","non_focused_opacity",1),
        set("diverging_automata.automata","state.1.opacity",0),
        "",
        hireUseActor("automata.cross_mark"),
        set(styleOf("automata.cross_mark"),"opacity",0.9),
        set("automata.cross_mark","x",700),
        set("automata.cross_mark","y",550),
        set("automata.cross_mark","scale",0.05),
        parallel(
            linear(0.5,"automata.cross_mark","x",0),
            linear(0.5,"automata.cross_mark","y",0),
            linear(0.5,"automata.cross_mark","scale",1)
        ),
        "",
        fadeOutAndFire(0.5,"automata.cross_mark"),
      // }}}
      // Second example {{{
        fadeOutAndFire(0.25,"diverging_automata.input.1.0"),
        hireAndFadeIn(0.25,"diverging_automata.input.1.1"),
        "",
        hireAndFadeInUseActor(0.5,"diverging_automata.reader"),
        smooth(0.5,"diverging_automata.marker","x",336.694),
        smooth(0.5,"diverging_automata.reader","x",106),
        parallel(
            accelerate(0.5,"diverging_automata.reader","x",500),
            parallel(
                wait(0.5),
                set("diverging_automata.automata","state.2.opacity",1),
                linear(0.75,"diverging_automata.automata","non_focused_opacity",0.33)
            ),
            sequence(
                parallel(
                    accelerate(0.25,"diverging_automata.marker","x",444.128),
                    accelerate(0.25,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.25,"diverging_automata.marker","x",336.694),
                    decelerate(0.25,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.20,"diverging_automata.marker","x",444.128),
                    accelerate(0.20,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.20,"diverging_automata.marker","x",336.694),
                    decelerate(0.20,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.15,"diverging_automata.marker","x",444.128),
                    accelerate(0.15,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.15,"diverging_automata.marker","x",336.694),
                    decelerate(0.15,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                ),
                parallel(
                    accelerate(0.10,"diverging_automata.marker","x",444.128),
                    accelerate(0.10,"diverging_automata.marker","y",-98.659)
                ),
                parallel(
                    decelerate(0.10,"diverging_automata.marker","x",336.694),
                    decelerate(0.10,"diverging_automata.marker","y",0)
                )
            )
        ),
        fire("diverging_automata.reader"),
        "",
        linear(0.75,"diverging_automata.automata","non_focused_opacity",1),
        set("diverging_automata.automata","state.2.opacity",0),
        "",
        hireUseActor("diverging_automata.check_mark"),
        set(styleOf("diverging_automata.check_mark"),"opacity",0.9),
        set("diverging_automata.check_mark","x",700),
        set("diverging_automata.check_mark","y",550),
        set("diverging_automata.check_mark","scale",0.05),
        parallel(
            linear(0.5,"diverging_automata.check_mark","x",0),
            linear(0.5,"diverging_automata.check_mark","y",0),
            linear(0.5,"diverging_automata.check_mark","scale",1)
        ),
      // }}}
      // Fade out everything {{{
        "",
        fadeOutAndFire(0.5,
            "diverging_automata.automata",
            "diverging_automata.automata.box",
            "diverging_automata.marker",
            "diverging_automata.criterion",
            "diverging_automata.criterion.highlight",
            "diverging_automata.check_mark",
            "diverging_automata.5tuple",
            "diverging_automata.5tuple.cover",
            "diverging_automata.5tuple.alphabet",
            "diverging_automata.5tuple.states",
            "diverging_automata.5tuple.transitions",
            "diverging_automata.5tuple.initial",
            "diverging_automata.5tuple.final",
            "diverging_automata.input.1.1",
            "diverging_automata.input.2",
            "diverging_automata.input.3",
            "diverging_automata.input.4plus"
        ),
      // }}}
    // }}}
    // Kleene's Theorem {{{
        rotateNextTitle(),
        "",
        hireAndFlashIn(0.75,0.375,
            "infinite_kleene1",
            "infinite_kleene2",
            "infinite_kleene3"
        ),
        "",
        fadeOutAndFire(0.5,
            "infinite_kleene1",
            "infinite_kleene2",
            "infinite_kleene3"
        ),
    // }}}
    // Characterization Theorem {{{
        rotateNextTitle(),
        "",
        hireAndFlashIn(0.75,0.375,
            "infinite_characterization_theorem_1",
            "infinite_characterization_theorem_2",
            "infinite_characterization_theorem_3"
        ),
        "",
        fadeOutAndFire(0.5,
            "infinite_characterization_theorem_1",
            "infinite_characterization_theorem_2",
            "infinite_characterization_theorem_3"
        ),
    // }}}
    // Diverging languages {{{
        rotateNextTitle(),
        hireAndFadeIn(0.5,"diverging_languages.borderlines"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.alphabet"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.semiring"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.words.finite"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.words.infinite"),
        "",
        hireAndFadeIn(0.5,"diverging_languages.language"),
        "",
        fadeOutAndFire(0.5,
            "diverging_languages.borderlines",
            "diverging_languages.alphabet",
            "diverging_languages.semiring",
            "diverging_languages.words.finite",
            "diverging_languages.words.infinite",
            "diverging_languages.language"
        ),
    // }}}
    // Rational diverging operations {{{
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "diverging_rational_operations_box_1",
            "diverging_rational_operations_box_2",
            "diverging_rational_operations_box_3",
            "diverging_rational_operations_box_4"
        ),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_1"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_1"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_2"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_2"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_3"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_3"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_precondition_4"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_4"),
        "",
        hireAndFadeInUseActor(0.5, "diverging_rational_operations_definition_5"),
        "",
        fadeOutAndFire(0.5,
            "diverging_rational_operations_box_1",
            "diverging_rational_operations_box_2",
            "diverging_rational_operations_box_3",
            "diverging_rational_operations_box_4",
            "diverging_rational_operations_precondition_1",
            "diverging_rational_operations_precondition_2",
            "diverging_rational_operations_precondition_3",
            "diverging_rational_operations_precondition_4",
            "diverging_rational_operations_definition_1",
            "diverging_rational_operations_definition_3",
            "diverging_rational_operations_definition_4"
        ),
        parallel(
            smooth(0.5,"diverging_rational_operations_definition_5","y",-450.0),
            smooth(0.5,"diverging_rational_operations_definition_2","y",-180.0)
        ),
        "",
        hireAndFadeInUseActor(0.5,"diverging_rational_operations_definition_6"),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_rational_operations_example_box",
            "diverging_rational_operations_example_input_frame",
            "diverging_rational_operations_example_input_1",
            "diverging_rational_operations_example_input_2",
            "diverging_rational_operations_example_input_3"
        ),
        "",
        hireAndFlashIn(0.5,0.25,
            "diverging_rational_operations_example_letter_1",
            "diverging_rational_operations_example_letter_2",
            "diverging_rational_operations_example_letter_3",
            "diverging_rational_operations_example_letter_4",
            "diverging_rational_operations_example_letter_mapsto",
            "diverging_rational_operations_example_output_box"
        ),
        "",
        hireAndFadeInUseActors(0.5,
            "diverging_rational_operations_example_letter_pointer",
            "diverging_rational_operations_example_output_0_mapsto"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_0_mapsto_0"),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",28),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_1_mapsto")
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",0.25)
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_1_mapsto_1_2"),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",1),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",1)
        ),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",52),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_2_mapsto")
        ),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",0.25)
        ),
        "",
        linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",1),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",0.25),
            linear(0.5,styleFor("diverging_rational_operations_example_input_2"),"opacity",1)
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_2_mapsto_5_4"),
        "",
        parallel(
            linear(0.5,styleFor("diverging_rational_operations_example_input_1"),"opacity",1),
            linear(0.5,styleFor("diverging_rational_operations_example_input_3"),"opacity",1)
        ),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",76),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_3_mapsto")
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_3_mapsto_0"),
        "",
        parallel(
            smooth(0.5,"diverging_rational_operations_example_letter_pointer","x",100),
            hireAndFadeIn(0.5,"diverging_rational_operations_example_output_4_mapsto")
        ),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_4_mapsto_5_2"),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_example_output_dots"),
        "",
        hireAndFadeIn(0.5,"diverging_rational_operations_identity"),
        "",
        hireAndFadeIn(0.5,"diverging_rational_language_definition"),
        "",
        fadeOutAndFire(0.5,
            "diverging_rational_operations_definition_2",
            "diverging_rational_operations_definition_5",
            "diverging_rational_operations_definition_6",
            "diverging_rational_operations_example_box",
            "diverging_rational_operations_example_input_frame",
            "diverging_rational_operations_example_input_1",
            "diverging_rational_operations_example_input_2",
            "diverging_rational_operations_example_input_3",
            "diverging_rational_operations_example_letter_1",
            "diverging_rational_operations_example_letter_2",
            "diverging_rational_operations_example_letter_3",
            "diverging_rational_operations_example_letter_4",
            "diverging_rational_operations_example_letter_mapsto",
            "diverging_rational_operations_example_output_box",
            "diverging_rational_operations_example_letter_pointer",
            "diverging_rational_operations_example_output_0_mapsto",
            "diverging_rational_operations_example_output_0_mapsto_0",
            "diverging_rational_operations_example_output_1_mapsto",
            "diverging_rational_operations_example_output_1_mapsto_1_2",
            "diverging_rational_operations_example_output_2_mapsto",
            "diverging_rational_operations_example_output_2_mapsto_5_4",
            "diverging_rational_operations_example_output_3_mapsto",
            "diverging_rational_operations_example_output_3_mapsto_0",
            "diverging_rational_operations_example_output_4_mapsto",
            "diverging_rational_operations_example_output_4_mapsto_5_2",
            "diverging_rational_operations_example_output_dots",
            "diverging_rational_operations_identity",
            "diverging_rational_language_definition"
        ),
    // }}}
    // Diverging automata {{{
        rotateNextTitle(),
        hireUseActors("diverging_automata.5tuple","diverging_automata.5tuple.cover"),
        linear(0.5,"diverging_automata.5tuple.cover","x",470),
        hireAndFlashIn(0.5,0.25,
            "diverging_automata.5tuple.alphabet",
            "diverging_automata.5tuple.states",
            "diverging_automata.5tuple.transitions",
            "diverging_automata.5tuple.initial",
            "diverging_automata.5tuple.final"
        ),
        "",
        hireAndFadeIn(0.5,"diverging_automata.criterion.1"),
        "",
        hireAndFadeIn(0.5,"diverging_automata.criterion.2"),
        "",
        fadeOutAndFire(0.5,
            "diverging_automata.5tuple",
            "diverging_automata.5tuple.alphabet",
            "diverging_automata.5tuple.cover",
            "diverging_automata.5tuple.states",
            "diverging_automata.5tuple.transitions",
            "diverging_automata.5tuple.initial",
            "diverging_automata.5tuple.final",
            "diverging_automata.criterion.1",
            "diverging_automata.criterion.2"
        ),
        hireAndFadeIn(0.5,"daas"),
        "",
        fadeOutAndFire(0.5,"daas"),
    // }}}
    // Kleene's Theorem {{{
        rotateNextTitle(),
        hireAndFlashIn(0.75,0.375,
            "diverging_kleene1",
            "diverging_kleene2",
            "diverging_kleene3"
        ),
        "",
        fadeOutAndFire(0.5,
            "diverging_kleene1",
            "diverging_kleene2",
            "diverging_kleene3"
        ),
    // }}}
    // Characterization Theorem {{{
        rotateNextTitle(),
        hireAndFlashIn(0.75,0.375,
            "diverging_characterization_theorem_1",
            "diverging_characterization_theorem_2",
            "diverging_characterization_theorem_3"
        ),
        "",
        fadeOutAndFire(0.5,
            "diverging_characterization_theorem_1",
            "diverging_characterization_theorem_2",
            "diverging_characterization_theorem_3"
        ),
    // }}}
  // }}}
// }}} Script
    ]))
},false)
