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
        ["dot_operator"],
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
    "Languages",
    "Rational Operations",
    "Automata",
    "Kleene's Theorem",
    "Outline",
    "Weighted Language",
    "Weighted Rational Operations",
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
        hireAndFadeIn(0.5,"outline",makePartFocusActor("outline",[
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
        ])),
        "",
        set("outline","languages.opacity",1),
        linear(0.5,"outline","non_focused_opacity",0.15),
        "",
        parallel(
            linear(0.5,"outline","languages.opacity",0.5),
            linear(0.5,"outline","weighted_languages.opacity",1),
            linear(0.5,"outline","weighted_languages_in_arrow.opacity",1),
            linear(0.5,"outline","infinite_languages.opacity",1),
            linear(0.5,"outline","infinite_languages_in_arrow.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","weighted_languages.opacity",0.5),
            linear(0.5,"outline","weighted_languages_in_arrow.opacity",0.5),
            linear(0.5,"outline","infinite_languages.opacity",0.5),
            linear(0.5,"outline","infinite_languages_in_arrow.opacity",0.5),
            linear(0.5,"outline","infinite_languages_out_arrow.opacity",1),
            linear(0.5,"outline","weighted_languages_out_arrow.opacity",1),
            linear(0.5,"outline","infinite_weighted_languages.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","infinite_languages_out_arrow.opacity",0.5),
            linear(0.5,"outline","weighted_languages_out_arrow.opacity",0.5),
            linear(0.5,"outline","infinite_weighted_languages.opacity",0.5),
            linear(0.5,"outline","escape_divergence.opacity",1),
            linear(0.5,"outline","escape_divergence_in_arrow.opacity",1),
            linear(0.5,"outline","embrace_divergence.opacity",1),
            linear(0.5,"outline","embrace_divergence_in_arrow.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","escape_divergence.opacity",0.5),
            linear(0.5,"outline","escape_divergence_in_arrow.opacity",0.5),
            linear(0.5,"outline","embrace_divergence.opacity",0.5),
            linear(0.5,"outline","embrace_divergence_in_arrow.opacity",0.5),
            linear(0.5,"outline","embrace_divergence_out_arrow.opacity",1),
            linear(0.5,"outline","infinite_matrix_product_states.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"outline","languages.opacity",1),
            linear(0.5,"outline","weighted_languages.opacity",0),
            linear(0.5,"outline","weighted_languages_in_arrow.opacity",0),
            linear(0.5,"outline","infinite_languages.opacity",0),
            linear(0.5,"outline","infinite_languages_in_arrow.opacity",0),
            linear(0.5,"outline","infinite_languages_out_arrow.opacity",0),
            linear(0.5,"outline","weighted_languages_out_arrow.opacity",0),
            linear(0.5,"outline","infinite_weighted_languages.opacity",0),
            linear(0.5,"outline","escape_divergence.opacity",0),
            linear(0.5,"outline","escape_divergence_in_arrow.opacity",0),
            linear(0.5,"outline","embrace_divergence.opacity",0),
            linear(0.5,"outline","embrace_divergence_in_arrow.opacity",0),
            linear(0.5,"outline","embrace_divergence_out_arrow.opacity",0),
            linear(0.5,"outline","infinite_matrix_product_states.opacity",0)
        ),
        "",
    // }}}
    // Languages {{{
        fadeOut(0.5,"outline"),
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
    // }}}
    // Rational Operations {{{
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
        rotateNextTitle(),
        hireAndFlashIn(0.5,0.25,
            "rational_operations_box_1",
            "rational_operations_box_2",
            "rational_operations_box_3"
        ),
        "",
        hireAndFlashIn(0.5,0.25,
            "rational_operations_op_1",
            "rational_operations_opdef_1"
        ),
        "",
        hireAndFadeIn(0.5,"rational_operations_example_1"),
        "",
        hireAndFlashIn(0.5,0.25,
            "rational_operations_op_2",
            "rational_operations_opdef_2"
        ),
        "",
        hireAndFadeIn(0.5,"rational_operations_example_2"),
        "",
        hireAndFlashIn(0.5,0.25,
            "rational_operations_op_3",
            "rational_operations_opdef_3"
        ),
        "",
        hireAndFadeIn(0.5,"rational_operations_example_3"),
        "",
        hireAndFadeIn(0.5,"rational_language_definition"),
        "",
        fadeOutAndFire(0.5,
            "rational_operations_box_1",
            "rational_operations_box_2",
            "rational_operations_box_3",
            "rational_operations_op_1",
            "rational_operations_opdef_1",
            "rational_operations_example_1",
            "rational_operations_op_2",
            "rational_operations_opdef_2",
            "rational_operations_example_2",
            "rational_operations_op_3",
            "rational_operations_opdef_3",
            "rational_operations_example_3",
            "rational_language_definition"
        ),
    // }}}
    // Automata {{{
        rotateNextTitle(),
      // Introduce the automata {{{
        hireUseActors("automata.5tuple","automata.5tuple.cover"),
        "",
        linear(0.5,"automata.5tuple.cover","x",470),
        hireAndFlashIn(0.5,0.25,
            "automata.5tuple.alphabet",
            "automata.5tuple.states",
            "automata.5tuple.transitions",
            "automata.5tuple.initial",
            "automata.5tuple.final"
        ),
        "",
        hire("automata.automata",makePartFocusActor("automata.automata",[
            "state.1",
            "state.2",
            "transitions",
            "transitions.initial",
        ])),
        parallel(
            decelerate(1,"automata.automata","x",520,0),
            hireAndFadeInUseActor(1,"automata.automata.box")
        ),
        "",
        parallel(
            linear(0.5,styleFor("automata.5tuple.states"),"opacity",0.33),
            linear(0.5,styleFor("automata.5tuple.transitions"),"opacity",0.33),
            linear(0.5,styleFor("automata.5tuple.initial"),"opacity",0.33),
            linear(0.5,styleFor("automata.5tuple.final"),"opacity",0.33),
            linear(0.5,"automata.automata","non_focused_opacity",0.33)
        ),
        "",
        parallel(
            linear(0.5,styleFor("automata.5tuple.alphabet"),"opacity",0.33),
            linear(0.5,styleFor("automata.5tuple.states"),"opacity",1),
            linear(0.5,"automata.automata","state.2.opacity",1),
            linear(0.5,"automata.automata","state.1.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("automata.5tuple.states"),"opacity",0.33),
            linear(0.5,styleFor("automata.5tuple.transitions"),"opacity",1),
            linear(0.5,"automata.automata","state.1.opacity",0.33),
            linear(0.5,"automata.automata","state.2.opacity",0.33),
            linear(0.5,"automata.automata","transitions.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("automata.5tuple.transitions"),"opacity",0.33),
            linear(0.5,styleFor("automata.5tuple.initial"),"opacity",1),
            linear(0.5,"automata.automata","transitions.opacity",0.33),
            linear(0.5,"automata.automata","state.1.opacity",1),
            linear(0.5,"automata.automata","transitions.initial.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,styleFor("automata.5tuple.initial"),"opacity",0.33),
            linear(0.5,styleFor("automata.5tuple.final"),"opacity",1),
            linear(0.5,"automata.automata","state.1.opacity",0.33),
            linear(0.5,"automata.automata","transitions.initial.opacity",0.33),
            linear(0.5,"automata.automata","state.2.opacity",1)
        ),
        "",
        parallel(
            linear(0.5,"automata.automata","non_focused_opacity",1),
            linear(0.5,styleFor("automata.5tuple.alphabet"),"opacity",1),
            linear(0.5,styleFor("automata.5tuple.states"),"opacity",1),
            linear(0.5,styleFor("automata.5tuple.transitions"),"opacity",1),
            linear(0.5,styleFor("automata.5tuple.initial"),"opacity",1),
            linear(0.5,styleFor("automata.5tuple.final"),"opacity",1)
        ),
        hireAndFadeIn(1,"automata.criterion"),
      // }}}
      // First example {{{
        "",
        hireAndFlashIn(0.5,0.25,
            "automata.input.1.0",
            "automata.input.2.0",
            "automata.input.3.1",
            "automata.input.4.0"
        ),
        "",
        hireAndFadeIn(0.5,"automata.marker",null,"automata.automata"),
        smooth(0.5,"automata.marker","x",124.169),
        "",
        hireAndFadeIn(0.5,"automata.reader"),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",210.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",124.169),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        smooth(0.5,"automata.reader","x",106),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",210.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",124.169),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        smooth(0.5,"automata.reader","x",212),
        "",
        smooth(0.5,"automata.marker","x",336.694),
        "",
        smooth(0.5,"automata.reader","x",318),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",444.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",336.694),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        fadeOut(0.5,"automata.reader"),
        "",
        hireUseActor("automata.check_mark"),
        set(styleOf("automata.check_mark"),"opacity",0.9),
        set("automata.check_mark","x",700),
        set("automata.check_mark","y",550),
        set("automata.check_mark","scale",0.05),
        parallel(
            linear(0.5,"automata.check_mark","x",0),
            linear(0.5,"automata.check_mark","y",0),
            linear(0.5,"automata.check_mark","scale",1)
        ),
      // }}}
      // Second example {{{
        "",
        fadeOutAndFire(0.5,"automata.check_mark"),
        "",
        fadeOutAndFire(0.25,"automata.input.2.0"),
        hireAndFadeIn(0.25,"automata.input.2.1"),
        "",
        smooth(0.5,"automata.marker","x",124.169),
        "",
        set("automata.reader","x",0),
        fadeIn(0.5,"automata.reader"),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",210.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",124.169),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        smooth(0.5,"automata.reader","x",106),
        "",
        smooth(0.5,"automata.marker","x",336.694),
        "",
        smooth(0.5,"automata.reader","x",212),
        "",
        parallel(
            sequence(
                linear(0.025,"automata.automata","x",20),
                linear(0.05,"automata.automata","x",-20),
                linear(0.05,"automata.automata","x",20),
                linear(0.05,"automata.automata","x",-20),
                linear(0.025,"automata.automata","x",0)
            ),
            sequence(
                linear(0.025,"automata.automata","y",10),
                linear(0.05,"automata.automata","y",-10),
                linear(0.05,"automata.automata","y",10),
                linear(0.05,"automata.automata","y",-10),
                linear(0.05,"automata.automata","y",10),
                linear(0.05,"automata.automata","y",-10),
                linear(0.025,"automata.automata","y",0)
            )
        ),
        "",
        fadeOut(0.5,"automata.reader"),
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
      // }}}
      // Third example {{{
        "",
        fadeOut(0.5,"automata.cross_mark"),
        "",
        parallel(
            sequence(
                fadeOutAndFire(0.25,"automata.input.2.1"),
                hireAndFadeIn(0.25,"automata.input.2.0",null,"automata.cross_mark")
            ),
            sequence(
                wait(0.125),
                fadeOutAndFire(0.25,"automata.input.3.1"),
                hireAndFadeIn(0.25,"automata.input.3.0",null,"automata.cross_mark")
            )
        ),
        "",
        smooth(0.5,"automata.marker","x",124.169),
        "",
        set("automata.reader","x",0),
        fadeIn(0.5,"automata.reader"),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",210.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",124.169),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        smooth(0.5,"automata.reader","x",106),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",210.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",124.169),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        smooth(0.5,"automata.reader","x",212),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",210.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",124.169),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        smooth(0.5,"automata.reader","x",318),
        "",
        parallel(
            accelerate(0.25,"automata.marker","x",210.128),
            accelerate(0.25,"automata.marker","y",-98.659)
        ),
        parallel(
            decelerate(0.25,"automata.marker","x",124.169),
            decelerate(0.25,"automata.marker","y",0)
        ),
        "",
        fadeOut(0.5,"automata.reader"),
        "",
        set("automata.automata","state.2.opacity",0),
        set("automata.automata","state.1.opacity",1),
        linear(0.5,"automata.automata","non_focused_opacity",0.25),
        "",
        linear(0.5,"automata.automata","non_focused_opacity",1),
        "",
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
      // }}}
      // Fade out everything {{{
        fadeOutAndFire(0.5,
            "automata.automata",
            "automata.automata.box",
            "automata.marker",
            "automata.criterion",
            "automata.cross_mark",
            "automata.5tuple",
            "automata.5tuple.cover",
            "automata.5tuple.alphabet",
            "automata.5tuple.states",
            "automata.5tuple.transitions",
            "automata.5tuple.initial",
            "automata.5tuple.final",
            "automata.input.1.0",
            "automata.input.2.0",
            "automata.input.3.0",
            "automata.input.4.0"
        ),
      // }}}
    // }}}
    // Kleene's Theorem {{{
        rotateNextTitle(),
        "",
        hireAndFlashIn(0.75,0.375,
            "kleene1",
            "kleene2",
            "kleene3"
        ),
        "",
        fadeOutAndFire(0.5,
            "kleene1",
            "kleene2",
            "kleene3"
        ),
    // }}}
    // Outline {{{
        rotateNextTitle(),
        fadeIn(0.5,"outline"),
        "",
        parallel(
            linear(0.5,"outline","languages.opacity",0.5),
            linear(0.5,"outline","weighted_languages.opacity",1),
            linear(0.5,"outline","weighted_languages_in_arrow.opacity",1)
        ),
        "",
        fadeOut(0.5,"outline"),
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
        hireAndFlashIn(0.5,0.25,
            "weighted_rational_operations_op_1",
            "weighted_rational_operations_opdef_1"
        ),
        "",
        hireAndFadeIn(0.5,"weighted_rational_operations_example_1"),
        "",
        hireAndFlashIn(0.5,0.25,
            "weighted_rational_operations_op_2",
            "weighted_rational_operations_opdef_2"
        ),
        "",
        hireAndFadeIn(0.5,"weighted_rational_operations_example_2"),
        "",
        hireAndFlashIn(0.5,0.25,
            "weighted_rational_operations_op_3",
            "weighted_rational_operations_opdef_3"
        ),
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
            "weighted_rational_operations_op_1",
            "weighted_rational_operations_opdef_1",
            "weighted_rational_operations_example_1",
            "weighted_rational_operations_op_2",
            "weighted_rational_operations_opdef_2",
            "weighted_rational_operations_example_2",
            "weighted_rational_operations_op_3",
            "weighted_rational_operations_opdef_3",
            "weighted_rational_operations_opdef_3_warning",
            "weighted_rational_operations_example_3",
            "weighted_rational_language_definition"
        ),
    // }}}
// }}} Script
    ]))
},false)
