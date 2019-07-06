# node-stream-8-to-10
Experiments to understand changes from node 8 to node 10 in the stream module

There's a single script here `test_shit.js`. The idea is to run it under different node versions using [nvm](https://github.com/nvm-sh/nvm) and [avn](https://github.com/wbyoung/avn):
```{bash}
cd node-8
# => avn activated 8.16.0 via .nvmrc (avn-nvm v8.16.0)
node ../test_shit.js > ./node-8-results.txt
# results written to file node-8-results.txt
cd ../node-10
# => avn activated 10.16.0 via .nvmrc (avn-nvm v10.16.0)
node ../test_shit.js > ./node-10-results.txt
# results written to file node-10-results.txt
```

The `node-8` and `node-10` folders here contain the requisite `.nvmrc` files and the output as text files for the most recent run on each version.
