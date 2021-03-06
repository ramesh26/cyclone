Gval
====

[![Build Status](https://travis-ci.org/PaesslerAG/gval.svg?branch=master)](https://travis-ci.org/PaesslerAG/gval)
[![Godoc](https://godoc.org/github.com/PaesslerAG/gval?status.png)](https://godoc.org/github.com/PaesslerAG/gval)

Gval (Go EVALuate) provides support for evaluating arbitrary expressions, in particular Go-like expressions.

Evaluate
--

Gval can evaluate expressions with parameters, arimethetic, logical, and string operations:

- basic expression: [10 > 0](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_basic)
- parameterized expression: [foo > 0](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_parameter)
- nested parameterized expression: [foo.bar > 0](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_nestedParameter)
- arithmetic expression: [(requests_made * requests_succeeded / 100) >= 90](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_arithmetic)
- string expression: [http_response_body == "service is ok"](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_string)
- float64 expression: [(mem_used / total_mem) * 100](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_float64)

It can easily be extended with custom functions or operators:

- custom date comparator: [date(\`2014-01-02\`) > date(\`2014-01-01 23:59:59\`)](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_dateComparison)
- string length: [strlen("someReallyLongInputString") <= 16](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_basic)

You can parse gval.Expressions once and re-use them multiple times. Parsing is the compute-intensive phase of the process, so if you intend to use the same expression with different parameters, just parse it once:

- [Parsing and Evaluation](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluable)

The normal Go-standard order of operators is respected. When writing an expression, be sure that you either order the operators correctly, or use parentheses to clarify which portions of an expression should be run first.

Strings, numbers, and booleans can be used like in Go:

- [(7 < "47" == true ? "hello world!\n\u263a") + \` more text\`](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluable)

Maps and Arrays
--

Parameter names like response-time will be interpreted as response minus time. While gval doesn't support these parameter names directly, you can easily access them via [JSON Path](https://github.com/PaesslerAG/jsonpath):

- [$["response-time"]](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_jsonpath)

Jsonpath is also suitable for accessing array elements.

Accessors
--

If you have structs in your parameters, you can access their fields and methods in the usual way:

- [foo.Hello + foo.World()](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_flatAccessor)

It also works if the parameter is a struct directly
[Hello + World()](https://godoc.org/github.com/PaesslerAG/gval/#accessor)
or if the fields are nested
[foo.Hello + foo.World()](https://godoc.org/github.com/PaesslerAG/gval/#example_Evaluate_nestedAccessor)

This may be convenient but note that using accessors makes the expression about four times slower than just using a parameter (consult the benchmarks for more precise measurements on your system). If there are functions you want to use, it's faster (and probably cleaner) to define them as functions (see the Evaluate section). These approaches use no reflection, and are designed to be fast and clean.

Default Language
--

- Modifiers: `+` `-` `/` `*` `&` `|` `^` `**` `%` `>>` `<<`
- Comparators: `>` `>=` `<` `<=` `==` `!=` `=~` `!~`
- Logical ops: `||` `&&`
- Numeric constants, as 64-bit floating point (`12345.678`)
- String constants (double quotes: `"foobar"`)
- Date function 'Date(x)', using any permutation of RFC3339, ISO8601, ruby date, or unix date
- Boolean constants: `true` `false`
- Parentheses to control order of evaluation `(` `)`
- Json Arrays : `[1, 2, "foo"]`
- Json Objects : `{"a":1, "b":2, "c":"foo"}`
- Prefixes: `!` `-` `~`
- Ternary conditional: `?` `:`
- Null coalescence: `??`

See [Godoc](https://godoc.org/github.com/PaesslerAG/gval/#Gval) for gval.Language details.

Customize
--

Gval is completly customizable. Every constant, function or operator can be defined separately and existing expressing languages can be reused:

- [foo.Hello + foo.World()](https://godoc.org/github.com/PaesslerAG/gval/#example_Language)

For details see [Godoc](https://godoc.org/github.com/PaesslerAG/gval).

Performance
--

The library is built with the intention of being quick but has not been aggressively profiled and optimized. For most applications, though, it is completely fine.
If performance is an issue, make sure to create your expression language with all functions, constants and operators only once. Evaluating an expression like gval.Evaluate("expression, const1, func1, func2, ...) creates a new gval.Language everytime it is called and slows execution.

The library comes with a bunch of benchmarks to measure the performance of parsing and evaluating expressions. You can run them with `go test -bench=.`.

For a very rough idea of performance, here are the results from a benchmark run on a Dell Latitude E7470 Win 10 i5-6300U.

``` text
BenchmarkGval/const_evaluation-4                               500000000                 3.57 ns/op
BenchmarkGval/const_parsing-4                                    1000000              1144 ns/op
BenchmarkGval/single_parameter_evaluation-4                     10000000               165 ns/op
BenchmarkGval/single_parameter_parsing-4                         1000000              1648 ns/op
BenchmarkGval/parameter_evaluation-4                             5000000               352 ns/op
BenchmarkGval/parameter_parsing-4                                 500000              2773 ns/op
BenchmarkGval/common_evaluation-4                                3000000               434 ns/op
BenchmarkGval/common_parsing-4                                    300000              4419 ns/op
BenchmarkGval/complex_evaluation-4                             100000000                11.6 ns/op
BenchmarkGval/complex_parsing-4                                   100000             17936 ns/op
BenchmarkGval/literal_evaluation-4                             300000000                 3.84 ns/op
BenchmarkGval/literal_parsing-4                                   500000              2559 ns/op
BenchmarkGval/modifier_evaluation-4                            500000000                 3.54 ns/op
BenchmarkGval/modifier_parsing-4                                  500000              3755 ns/op
BenchmarkGval/regex_evaluation-4                                   50000             21347 ns/op
BenchmarkGval/regex_parsing-4                                     200000              6480 ns/op
BenchmarkGval/constant_regex_evaluation-4                        1000000              1000 ns/op
BenchmarkGval/constant_regex_parsing-4                            200000              9417 ns/op
BenchmarkGval/accessors_evaluation-4                             3000000               417 ns/op
BenchmarkGval/accessors_parsing-4                                1000000              1778 ns/op
BenchmarkGval/accessors_method_evaluation-4                      1000000              1931 ns/op
BenchmarkGval/accessors_method_parsing-4                         1000000              1729 ns/op
BenchmarkGval/accessors_method_parameter_evaluation-4            1000000              2162 ns/op
BenchmarkGval/accessors_method_parameter_parsing-4                500000              2618 ns/op
BenchmarkGval/nested_accessors_evaluation-4                      2000000               681 ns/op
BenchmarkGval/nested_accessors_parsing-4                         1000000              2115 ns/op
BenchmarkRandom-4                                                 500000              3631 ns/op
ok
```

API Breaks
--

The library is designed for API stability but the classification of gvals sub languages is not final yet. Releases will explicitly state when an API break happens, and if they do not specify an API break it should be safe to upgrade.

Missing Features
--

- [ ] Expression Formatter
- [ ] SQL Expression
- [ ] Examples for Language