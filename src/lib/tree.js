/* @flow */

export type TreeNodeType<T> = {|
    getValue : () => T,
    addNode : (TreeNodeType<T>) => void,
    getParent : () => ?TreeNodeType<T>,
    setParent : (TreeNodeType<T>) => void,
    getRoot : () => TreeNodeType<T>,
    getLongestBranchAndLength : () => {| length : number, node : TreeNodeType<T> |},
    getLongestBranch : () => TreeNodeType<T>,
    find : ((TreeNodeType<T>) => boolean) => ?TreeNodeType<T>,
    findValue : ((T) => boolean) => ?TreeNodeType<T>,
    getChain : () => Array<TreeNodeType<T>>,
    getLongestChain : () => Array<TreeNodeType<T>>,
    getLongestChainAsValues : () => Array<T>,
    getIndex : () => number
|};

export function TreeNode<T>(value : T) : TreeNodeType<T> {
    let parent;

    // $FlowFixMe
    const defaultNode = () : TreeNodeType<T> => ({});

    const node : TreeNodeType<T> = defaultNode();
    const branches = [];

    const addNode = (childNode) => {
        branches.push(childNode);
        childNode.setParent(node)
    };

    const getValue = () => {
        return value;
    }

    const getParent = () => {
        return parent;
    };

    const setParent = (parentNode) => {
        parent = parentNode;
    }

    const getRoot = () => {
        let root = node;
        while (true) {
            const newRoot = root.getParent();
            if (newRoot) {
                root = newRoot;
            } else {
                break
            }
        }
        return root;
    };

    const getLongestBranchAndLength = () => {
        let longestBranch = {
            length: 0,
            node
        };

        for (let branch of branches) {
            const longestSubBranch = branch.getLongestBranchAndLength();

            if (!longestBranch || longestSubBranch.length >= longestBranch.length) {
                longestBranch = longestSubBranch; 
            }
        }

        return longestBranch;
    };

    const getLongestBranch = () => {
        return getLongestBranchAndLength().node;
    };

    const find = (predicate) => {
        if (predicate(node)) {
            return node;
        }

        for (let branch of branches) {
            const result = branch.find(predicate);

            if (result) {
                return result;
            }
        }
    };

    const findValue = (predicate) => {
        return find(node => predicate(node.getValue()));
    };

    const getChain = () => {
        let current = node;
        const nodes = [];

        while (current) {
            nodes.unshift(current);
            current = current.getParent();
        }

        return nodes;
    };

    const getLongestChain = () => {
        return getLongestBranch().getChain();
    }

    const getLongestChainAsValues = () => {
        return getLongestBranch().getChain().map(node => node.getValue());
    }

    const getIndex = () => {
        let index = 0;
        let current = node;
        while (true) {
            const parent = current.getParent();
            if (!parent) {
                break;
            }
            index += 1;
            current = parent;
        }
        return index;
    };

    node.getValue = getValue;
    node.addNode = addNode;
    node.getParent = getParent;
    node.setParent = setParent;
    node.getRoot = getRoot;
    node.getLongestBranchAndLength = getLongestBranchAndLength;
    node.getLongestBranch = getLongestBranch;
    node.find = find;
    node.findValue = findValue;
    node.getChain = getChain;
    node.getLongestChain = getLongestChain;
    node.getLongestChainAsValues = getLongestChainAsValues;
    node.getIndex = getIndex;

    return node;
}
