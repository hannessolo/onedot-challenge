import issues from './issue.js';

export default class Dictionary {

  constructor(name) {
    this.kvpairs = {};
    this.name = name;
    this.issues = 0;
    this.size = 0;

    this.get = this.get.bind(this);
  }

  put(key, value, id) {
    let newPair = {
      key,
      value,
      issues: []      // List of confilicts with other pairs
    };
    this.verify(newPair);
    this.kvpairs[id] = newPair;
    this.size++;
    console.log(this.kvpairs)
  }

  get(id) {
    return this.kvpairs[id];
  }

  all() {
    return Object.entries(this.kvpairs).map(([key, value]) => value);
  }

  remove(id) {
    let pair = this.kvpairs[id];
    delete this.kvpairs[id];
    for (let issue of pair.issues) {
      // remove issues
      if (issue.type == issues.FORK || issue.type == issues.DUPLICATE) {
        let otherNode = issue.other;
        for (let candidate of otherNode.issues.filter(issue => issue.type == issues.DUPLICATE || issue.type == issues.FORK)) {
          if (candidate.other == pair) {
            otherNode.issues.splice(otherNode.issues.indexOf(candidate), 1);
          }
        }
      }
    }
    this.size--;
  }

  // Mark issues that a new pair causes
  verify(newPair) {
    console.log('verifiying...')

    for (let [id, pair] of Object.entries(this.kvpairs)) {

      // The value is equal to a key
      if (newPair.value == pair.key) {

        let issue = {
          type: issues.CHAIN,
          next: pair,
          prev: null
        };
        newPair.issues.push(issue);

        // search for existing issues
        let prevIssues = pair.issues.filter(issue => issue.type == issues.CHAIN || issue.type == issues.CYCLE);

        if (prevIssues.length == 0) {
          // Previous pair has no issues. Create new chain issue.
          pair.issues.push({
            type: issues.CHAIN,
            next: null,
            prev: newPair
          });
        } else {
          for (let issue of prevIssues) {
            if (issue.prev == null) {
              issue.prev = newPair;
            } else {
              // There is already a chain through this node. Duplicate node.
              let duplicateIssue = {...issue};
              duplicateIssue.prev = newPair;
              pair.issues.push(duplicateIssue);
            }
          }
        }

        let f = this.followChain(pair, newPair, newPair, issue, false);
        break;
      }

      // The key is equal to a value
      if (newPair.key == pair.value) {
        let issue = {
          type: issues.CHAIN,
          next: null,
          prev: pair
        };
        newPair.issues.push(issue);

        // search for existing issues
        let prevIssues = pair.issues.filter(issue => issue.type == issues.CHAIN || issue.type == issues.CYCLE);

        if (prevIssues.length == 0) {
          // Previous pair has no issues. Create new chain issue.
          pair.issues.push({
            type: issues.CHAIN,
            next: newPair,
            prev: null
          });
        } else {
          // Previous pair already has issues. Edit old issues.
          for (let issue of prevIssues) {
            if (issue.next == null) {
              // The chain ends at this node. Set next.
              issue.next = newPair
            } else {
              // There is already a chain through this node. Duplicate node.
              let duplicateIssue = {...issue};
              duplicateIssue.next = newPair;
              pair.issues.push(duplicateIssue);
            }
          }
        }

        let f = this.followChain(pair, newPair, newPair, issue, true);
        break;
      }

      // The key is equal to another key
      if (pair.key === newPair.key) {
        // Check if fork or duplicate
        if (pair.value === newPair.value) {
          newPair.issues.push({
            type: issues.DUPLICATE,
            // keep a reference to the other node causing the problem
            other: pair
          });
          pair.issues.push({
            type: issues.DUPLICATE,
            other: newPair
          });
        } else {
          newPair.issues.push({
            type: issues.FORK,
            other: pair
          });
          pair.issues.push({
            type: issues.FORK,
            other: newPair
          });
        }
        break;
      }
    }
  }

  // Follows a chain and detects any cycles
  followChain(node, lastVisited, initialNode, initialIssue, reverse) {

    if (node == null) {
      return false;
    }

    let compareTo = reverse ? initialNode.value : initialNode.key;
    let value = reverse ? node.key : node.value;

    if (value == compareTo) {
      initialIssue.type = issues.CYCLE;
      // set initial issue to point here
      if (reverse) {
        initialIssue.next = node;
      } else {
        initialIssue.prev = node;
      }
      // set here to point to initial node
      for (let candidate of node.issues.filter(issue => issue.type == issues.CHAIN)) {
        if (reverse && candidate.next == lastVisited) {
          candidate.prev = initialNode;
          candidate.type = issues.CYCLE;
        } else if (!reverse && candidate.prev == lastVisited) {
          candidate.next = initialNode;
          candidate.type = issues.CYCLE;
        }
      }

      return true;
    }

    // List of nodes that are the next in our next node's issues
    let nextCandidateIssues = node.issues
      .filter(issue => issue.type == issues.CHAIN)
      .filter(issue => issue.next != null);

    let foundCycle = false;
    for (let candidate of nextCandidateIssues) {
      // If a cycle was found on this path, mark this node as in a cycle
      if (this.followChain(reverse ? candidate.prev : candidate.next, node, initialNode, initialIssue, reverse)) {
        candidate.type = issues.CYCLE;
        foundCycle = true;
      }
    }

    return foundCycle;
  }

}
