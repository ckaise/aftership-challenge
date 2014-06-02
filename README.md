# Get Tracking info from Courier

The goal of this challenge is to get the tracking information from the courier's system.

There are 3 tests:

```

www.usps.com: 9102999999302024326992
www.hongkongpost.com: CP889331175HK
www.dpd.co.uk: 15502370264989N


More Samples:
www.usps.com
9400109699939938223564
9374889949033131111143
9405509699939943080223


www.hongkongpost.com
RC933607107HK
RT224265042HK
LK059460815HK


www.ups.com
1Z602A6E0315093333
1ZE155W1YW70248655
1ZE155W1YW70248520
1Z17R06A0367864113

www.dpd.co.uk
15501498140350
15501733652085
07081002031105O


```


## The Output Format

The first thing you should do is read `test/index.js`. It is the **canonical reference**. As long as your crawler correctly implements the reference tests, it is considered a correct solution.


# Usage

## Instructions

1. Clone this repository to your own Github `public` repository and development machine. Do NOT fork, as other candidates would be able to see your solution. Do preserve commit history so it is easy for us to add your repository as a remote.
2. Send us a link to the public repository you used and an estimate of how long you will take
3. Run `npm install`
4. Implement `Courier` in `lib/index.js`
5. Ensure all tests pass in node via `npm test`
6. When finished, send us an email to ask for a review
7. You may modify the test case, or using other tracking number. as the tracking number in the test case may be expired.

## Hints

* Before starting, try to see how AfterShip API work, you will get a better idea what tracking info should return.
* You can use ANY method to get the tracking result, including API, web crawler, or even you paid someone else to code for you. LoL

## Scoring

There is no scoring at all.

What we want to know is HOW do you solve the problems.

However,

**You will be graded on how easy-to-{read,maintain,verify} your code and documentation are.** Really think from the perspective of what would happen if we had to actually integrate your code into our production environment.

Ideally your solution is **easily extensible** as we add additional types of test cases.

## Problem?
Contact us at jobs AT aftership.com

