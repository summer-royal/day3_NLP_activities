export const CONCEPTS = [
  {
    id: "pixels",
    label: "How Computers See",
    year: "~1960",
    bigIdea: "An image is just a grid of numbers.",
    motivation:
      "Before a computer can recognize a cat or read a road sign, it needs to store a picture as something it can do math with. The solution: break the image into a grid of tiny squares, and store each square as three numbers.",
    activity:
      "Paint a pixel art image by choosing RGB values for each color zone. Then flip to number view to see what the computer actually stores.",
    newIdea:
      "Every pixel is three numbers — red, green, blue — each between 0 and 255. An image is a grid of those triplets.",
    remainingProblems:
      "Raw pixel grids have no structure a computer can exploit. Nearby pixels that belong together look completely unrelated when you scan through the grid row by row.",
  },
  {
    id: "neuron",
    label: "One Neuron",
    year: "~1965",
    bigIdea: "A single unit can learn to make a decision from numbers.",
    motivation:
      "Once you can represent an image as numbers, you need something that can learn from those numbers. Researchers built the simplest possible learner: a unit that multiplies each input by a weight, sums everything up, and decides yes or no.",
    activity:
      "Pick a yes/no question. Add inputs and set their weights. Then step through the math your neuron uses to decide.",
    newIdea:
      "Multiply each input by its weight, sum everything, pass through an activation — that's ONE neuron. You can change the importance of each input by changing the weights. The inputs that your neuron takes in, the weights each input has, and the activation function you choose can all affect the neuron's decision!",
    remainingProblems:
      "So far, we've only looked at ONE neuron. One neuron can only distinguish between simple binary (yes or no) classes. For more complex models, we need more neurons. Next, we'll talk about having multiple neurons in each layer and having multiple layers!",
  },
  {
    id: "network",
    label: "A Network",
    year: "~1986",
    bigIdea: "Stack neurons in layers to learn any boundary.",
    motivation:
      "A single neuron can't solve XOR — a pattern where neither coordinate alone tells you the class. In 1986, researchers proved that chaining two layers of neurons together could learn any boundary, not just straight ones.",
    activity:
      "See why one neuron fails on XOR. Add a hidden layer and watch the network solve it. Then step through the forward pass yourself.",
    newIdea:
      "Hidden layers compose simple decisions into complex ones. Each layer transforms the data into a new representation the next layer can use.",
    remainingProblems:
      "We can stack layers — but how do we train all those weights? Adjusting thousands of numbers by hand is impossible.",
  },
  {
    id: "convolutions",
    label: "Seeing Patterns (optional)",
    year: "~1998",
    bigIdea: "Slide a small filter across the image to detect local patterns.",
    motivation:
      "A flat network treats every pixel as equally related to every other pixel. But images have local structure — edges, corners, textures — that show up in small regions. In 1998, Yann LeCun built LeNet around one insight: scan small filters across the image instead.",
    activity:
      "Pick a filter and step it across a pixel grid. See how edge detectors, blur, and sharpening filters each produce a different feature map.",
    newIdea:
      "A filter is a tiny grid of weights that slides across the image. At each position it computes one number. The result — the feature map — shows where that pattern appeared.",
    remainingProblems:
      "Even CNNs need large amounts of labeled training data. Collecting and labeling images is slow and expensive.",
  },
  {
    id: "digits",
    label: "Digit Classifier",
    year: "~2012",
    bigIdea: "A trained CNN can read handwriting it has never seen.",
    motivation:
      "We've seen how convolutions detect patterns and how training adjusts weights. Now try it on a real model: draw a digit and watch a trained convolutional network classify it — layer by layer.",
    activity:
      "Draw a digit 0–9. The model processes it through two convolutional layers and ten output neurons. See which filters activated and what the network decided.",
    newIdea:
      "A trained CNN maps raw pixel values through learned filters to a probability over classes. The winning class is the network's prediction.",
    remainingProblems:
      "Even a high-accuracy model on clean handwriting can be fooled by unusual styles, rotations, or slight shifts. Robustness to real-world variation is still an open problem.",
  },
  {
    id: "training",
    label: "Learning to See",
    year: "~2012",
    bigIdea: "Measure your error, nudge every weight a little, repeat.",
    motivation:
      "In 2012, AlexNet crushed every competitor in the ImageNet challenge. It trained a deep CNN on a million labeled photos with a consumer GPU. The secret was gradient descent at scale — measuring error, computing which direction to nudge each weight, and repeating millions of times.",
    activity:
      "Watch a network start with random weights and no idea what it's doing. Click Train and watch the decision boundary shift as loss falls.",
    newIdea:
      "Gradient descent: run the network forward, measure how wrong it is, work backwards to find which weights caused the error, nudge each one a tiny step. Given enough data and epochs, the network converges.",
    remainingProblems:
      "These networks need millions of labeled examples and days of GPU time. Real-world vision — self-driving cars, medical imaging — pushes the limits of what labeled data can teach.",
  },
];
