# Zenobot

Check it out via  [garrettwatson.io](https://garrettwatson.io)

# About

Zenobot is an LSTM neural network that was trained, using PyTorch, on a small dataset of 2000 proverbs.

The model is served up via a simple Flask API, [code here](https://github.com/garrowat/zenobot)

Zenobot does its very best to predict the next character in a string, stopping when it predicts a period.
