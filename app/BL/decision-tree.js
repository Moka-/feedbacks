var _ = require('lodash');

module.exports = (function() {
    const NODE_TYPES = DecisionTreeID3.NODE_TYPES = {
        RESULT: 'result',
        FEATURE: 'feature',
        FEATURE_VALUE: 'feature_value'
    };

    var igs;
    var model;

    function DecisionTreeID3(data, target, features) {
        this.data = data;
        this.target = target;
        this.features = features;
        igs = {};
        model = createTree(data, target, features);
    }

    DecisionTreeID3.prototype = {

        predict: function(sample) {
            var root = model;
            while (root.type !== NODE_TYPES.RESULT) {
                var attr = root.name;
                var sampleVal = sample[attr];
                var childNode = _.detect(root.vals, function(node) {
                    return node.name == sampleVal
                });
                if (childNode){
                    root = childNode.child;
                } else {
                    root = root.vals[0].child;
                }
            }

            return root.val;
        },

        evaluate: function(samples) {
            var instance = this;
            var target = this.target;

            var total = 0;
            var correct = 0;

            _.each(samples, function(s) {
                total++;
                var pred = instance.predict(s);
                var actual = s[target];
                if (pred == actual) {
                    correct++;
                }
            });

            return correct / total;
        },

        import: function(json) {
            model = json;
        },

        toJSON: function() {
            return model;
        },

        igRanks: function() {
            var res = [];

            for (var key in igs) {
                if (igs.hasOwnProperty(key)) {
                    res.push({word: key, score: igs[key]});
                }
            }

            return res;
        }
    };

    function createTree(data, target, features) {
        var targets = _.unique(_.pluck(data, target));
        if (targets.length == 1) {
            return {
                type: NODE_TYPES.RESULT,
                val: targets[0],
                name: targets[0],
                alias: targets[0] + randomUUID()
            };
        }

        if (features.length == 0) {
            var topTarget = mostCommon(targets);
            return {
                type: NODE_TYPES.RESULT,
                val: topTarget,
                name: topTarget,
                alias: topTarget + randomUUID()
            };
        }

        var bestFeature = maxGain(data, target, features);
        var remainingFeatures = _.without(features, bestFeature);
        var possibleValues = _.unique(_.pluck(data, bestFeature));

        var node = {
            name: bestFeature,
            alias: bestFeature + randomUUID()
        };

        node.type = NODE_TYPES.FEATURE;
        node.vals = _.map(possibleValues, function(v) {
            var _newS = data.filter(function(x) {
                return x[bestFeature] == v
            });

            var child_node = {
                name: v,
                alias: v + randomUUID(),
                type: NODE_TYPES.FEATURE_VALUE
            };

            child_node.child = createTree(_newS, target, remainingFeatures);
            return child_node;
        });

        return node;
    }

    function entropy(vals) {
        var uniqueVals = _.unique(vals);
        var probs = uniqueVals.map(function(x) {
            return prob(x, vals)
        });

        var logVals = probs.map(function(p) {
            return -p * log2(p)
        });

        return logVals.reduce(function(a, b) {
            return a + b
        }, 0);
    }

    function gain(data, target, feature) {
        var attrVals = _.unique(_.pluck(data, feature));
        var setEntropy = entropy(_.pluck(data, target));
        var setSize = _.size(data);

        var entropies = attrVals.map(function(n) {
            var subset = data.filter(function(x) {
                return x[feature] === n
            });

            return (subset.length / setSize) * entropy(_.pluck(subset, target));
        });

        var sumOfEntropies = entropies.reduce(function(a, b) {
            return a + b
        }, 0);

        var ig = setEntropy - sumOfEntropies;
        if (!igs[feature]){
            igs[feature] = ig * Math.pow(setSize, 2);
        } else {
            igs[feature] += ig * Math.pow(setSize, 2);
        }

        return ig;
    }

    function maxGain(data, target, features) {
        return _.max(features, function(element) {
            return gain(data, target, element)
        });
    }

    function prob(value, list) {
        var occurrences = _.filter(list, function(element) {
            return element === value
        });

        var numOccurrences = occurrences.length;
        var numElements = list.length;
        return numOccurrences / numElements;
    }

    function log2(n) {
        return Math.log(n) / Math.log(2);
    }

    function mostCommon(list) {
        var elementFrequencyMap = {};
        var largestFrequency = -1;
        var mostCommonElement = null;

        list.forEach(function(element) {
            var elementFrequency = (elementFrequencyMap[element] || 0) + 1;
            elementFrequencyMap[element] = elementFrequency;

            if (largestFrequency < elementFrequency) {
                mostCommonElement = element;
                largestFrequency = elementFrequency;
            }
        });

        return mostCommonElement;
    }

    function randomUUID() {
        return "_r" + Math.random().toString(32).slice(2);
    }

    return DecisionTreeID3;
})();
