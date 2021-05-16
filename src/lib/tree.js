/* @flow */

export type TreeNodeType<T> = {|
    getValue : () => T,
    addChildNode : (TreeNodeType<T>) => void,
    addChildNodeValue : (T) => void,
    getParent : () => TreeNodeType<T>,
    setParent : (TreeNodeType<T>) => void,
    getRoot : () => TreeNodeType<T>,
    getLongestBranchAndLength : () => {| length : number, node : TreeNodeType<T> |},
    getLongestBranchNode : () => TreeNodeType<T>,
    getLongestBranchValue : () => T,
    find : ((TreeNodeType<T>) => boolean) => ?TreeNodeType<T>,
    findValue : ((T) => boolean) => ?TreeNodeType<T>,
    findValueByID : (string) => ?TreeNodeType<T>,
    getChain : () => Array<TreeNodeType<T>>,
    getLongestChain : () => Array<TreeNodeType<T>>,
    getLongestChainAsValues : () => Array<T>
|};

export function TreeNode<T>(value : T) : TreeNodeType<T> {
    let parent;

    // $FlowFixMe
    const defaultNode = () : TreeNodeType<T> => ({});

    const node : TreeNodeType<T> = defaultNode();
    const branches = [];

    const addChildNode = (childNode) => {
        branches.push(childNode);
        childNode.setParent(node)
    };

    const addChildNodeValue = (val) => {
        addChildNode(TreeNode(val))
    };

    const getValue = () => {
        return value;
    }

    const getParent = () => {
        return parent || node;
    };

    const setParent = (parentNode) => {
        parent = parentNode;
    }

    const getRoot = () => {
        let root = node;
        while (true) {
            const newRoot = root.getParent();
            if (newRoot && newRoot !== root) {
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

    const getLongestBranchNode = () => {
        return getLongestBranchAndLength().node;
    };

    const getLongestBranchValue = () => {
        return getLongestBranchNode().getValue();
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

    const findValueByID = (id) => {
        // $FlowFixMe
        return findValue(value => value.id === id);
    };

    const getChain = () => {
        let current = node;
        const nodes = [];

        while (current) {
            const parent = current.getParent();
            if (parent === current) {
                break;
            }
            nodes.unshift(current);
            current = parent;
        }

        return nodes;
    };

    const getLongestChain = () => {
        return getLongestBranchNode().getChain();
    }

    const getLongestChainAsValues = () => {
        return getLongestBranchNode().getChain().map(node => node.getValue());
    }

    node.getValue = getValue;
    node.addChildNode = addChildNode;
    node.addChildNodeValue = addChildNodeValue;
    node.getParent = getParent;
    node.setParent = setParent;
    node.getRoot = getRoot;
    node.getLongestBranchAndLength = getLongestBranchAndLength;
    node.getLongestBranchNode = getLongestBranchNode;
    node.getLongestBranchValue = getLongestBranchValue;
    node.find = find;
    node.findValue = findValue;
    node.findValueByID = findValueByID;
    node.getChain = getChain;
    node.getLongestChain = getLongestChain;
    node.getLongestChainAsValues = getLongestChainAsValues;

    return node;
}
