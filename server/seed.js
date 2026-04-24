require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const questions = [

  // DSA
  { subject: 'dsa', difficulty: 'easy', question: 'What is an array and how is it different from a linked list?', expectedKeywords: ['contiguous', 'memory', 'index', 'pointer', 'dynamic'] },
  { subject: 'dsa', difficulty: 'medium', question: 'Explain binary search and its time complexity.', expectedKeywords: ['sorted', 'O(log n)', 'mid', 'divide', 'halve'] },
  { subject: 'dsa', difficulty: 'medium', question: 'What is a stack and where is it used?', expectedKeywords: ['LIFO', 'push', 'pop', 'recursion', 'undo'] },
  { subject: 'dsa', difficulty: 'medium', question: 'Explain BFS and DFS graph traversal.', expectedKeywords: ['queue', 'stack', 'visited', 'level', 'depth'] },
  { subject: 'dsa', difficulty: 'hard', question: 'What is dynamic programming? Give an example.', expectedKeywords: ['memoization', 'subproblem', 'overlapping', 'fibonacci', 'knapsack'] },
  { subject: 'dsa', difficulty: 'hard', question: 'Explain quicksort and its average time complexity.', expectedKeywords: ['pivot', 'partition', 'O(n log n)', 'recursive', 'in-place'] },
  { subject: 'dsa', difficulty: 'medium', question: 'What is a hash table and how does it handle collisions?', expectedKeywords: ['hash function', 'chaining', 'open addressing', 'O(1)', 'bucket'] },

  // Operating Systems
  { subject: 'os', difficulty: 'easy', question: 'What is the difference between a process and a thread?', expectedKeywords: ['memory', 'lightweight', 'shared', 'independent', 'context switch'] },
  { subject: 'os', difficulty: 'medium', question: 'Explain deadlock and the four conditions for it.', expectedKeywords: ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait'] },
  { subject: 'os', difficulty: 'medium', question: 'What is virtual memory and why is it used?', expectedKeywords: ['paging', 'swap', 'RAM', 'address space', 'page fault'] },
  { subject: 'os', difficulty: 'medium', question: 'Explain CPU scheduling algorithms.', expectedKeywords: ['FCFS', 'SJF', 'Round Robin', 'priority', 'preemptive'] },
  { subject: 'os', difficulty: 'hard', question: 'What is a semaphore and how does it differ from a mutex?', expectedKeywords: ['synchronization', 'binary', 'counting', 'lock', 'signal'] },
  { subject: 'os', difficulty: 'easy', question: 'What is thrashing in an operating system?', expectedKeywords: ['page fault', 'swapping', 'CPU utilization', 'working set'] },

  // DBMS
  { subject: 'dbms', difficulty: 'easy', question: 'What is normalization? Explain 1NF, 2NF, 3NF.', expectedKeywords: ['redundancy', 'dependency', 'primary key', 'partial', 'transitive'] },
  { subject: 'dbms', difficulty: 'medium', question: 'What is the difference between INNER JOIN and LEFT JOIN?', expectedKeywords: ['matching', 'null', 'all rows', 'intersection', 'left table'] },
  { subject: 'dbms', difficulty: 'medium', question: 'Explain ACID properties in databases.', expectedKeywords: ['atomicity', 'consistency', 'isolation', 'durability', 'transaction'] },
  { subject: 'dbms', difficulty: 'hard', question: 'What is indexing and how does it improve query performance?', expectedKeywords: ['B-tree', 'search', 'faster', 'disk', 'clustered'] },
  { subject: 'dbms', difficulty: 'medium', question: 'What is the difference between SQL and NoSQL databases?', expectedKeywords: ['structured', 'schema', 'scalability', 'MongoDB', 'flexible'] },
  { subject: 'dbms', difficulty: 'easy', question: 'What is a primary key vs foreign key?', expectedKeywords: ['unique', 'reference', 'constraint', 'relationship', 'null'] },

  // Computer Networks
  { subject: 'cn', difficulty: 'easy', question: 'Explain the OSI model and its 7 layers.', expectedKeywords: ['physical', 'data link', 'network', 'transport', 'application'] },
  { subject: 'cn', difficulty: 'medium', question: 'What is the difference between TCP and UDP?', expectedKeywords: ['reliable', 'connection', 'handshake', 'faster', 'streaming'] },
  { subject: 'cn', difficulty: 'medium', question: 'How does DNS work?', expectedKeywords: ['domain', 'IP', 'resolver', 'lookup', 'nameserver'] },
  { subject: 'cn', difficulty: 'hard', question: 'Explain the TCP three-way handshake.', expectedKeywords: ['SYN', 'SYN-ACK', 'ACK', 'connection', 'establish'] },
  { subject: 'cn', difficulty: 'medium', question: 'What is HTTP vs HTTPS?', expectedKeywords: ['SSL', 'TLS', 'encryption', 'certificate', 'secure'] },
  { subject: 'cn', difficulty: 'easy', question: 'What is an IP address and what is subnetting?', expectedKeywords: ['IPv4', 'IPv6', 'subnet mask', 'CIDR', 'network'] },

  // OOP
  { subject: 'oop', difficulty: 'easy', question: 'Explain the four pillars of OOP.', expectedKeywords: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction'] },
  { subject: 'oop', difficulty: 'medium', question: 'What is the difference between abstraction and encapsulation?', expectedKeywords: ['hiding', 'implementation', 'interface', 'data', 'access'] },
  { subject: 'oop', difficulty: 'medium', question: 'Explain method overloading vs method overriding.', expectedKeywords: ['compile time', 'runtime', 'same name', 'signature', 'polymorphism'] },
  { subject: 'oop', difficulty: 'hard', question: 'What is the SOLID principle?', expectedKeywords: ['single responsibility', 'open closed', 'Liskov', 'interface', 'dependency'] },
  { subject: 'oop', difficulty: 'medium', question: 'What is an abstract class vs an interface?', expectedKeywords: ['implement', 'extend', 'multiple', 'method body', 'contract'] },

  // System Design
  { subject: 'systemdesign', difficulty: 'medium', question: 'How would you design a URL shortener like bit.ly?', expectedKeywords: ['hash', 'database', 'redirect', 'unique', 'collision'] },
  { subject: 'systemdesign', difficulty: 'hard', question: 'Explain horizontal vs vertical scaling.', expectedKeywords: ['load balancer', 'more machines', 'upgrade', 'bottleneck', 'distributed'] },
  { subject: 'systemdesign', difficulty: 'hard', question: 'What is a CDN and why is it used?', expectedKeywords: ['content delivery', 'edge', 'latency', 'cache', 'geographic'] },
  { subject: 'systemdesign', difficulty: 'medium', question: 'What is caching and what are common strategies?', expectedKeywords: ['Redis', 'TTL', 'LRU', 'hit', 'miss'] },
  { subject: 'systemdesign', difficulty: 'hard', question: 'How does a message queue work? Give an example.', expectedKeywords: ['async', 'producer', 'consumer', 'Kafka', 'RabbitMQ'] },

  // Machine Learning
  { subject: 'ml', difficulty: 'easy', question: 'What is the difference between supervised and unsupervised learning?', expectedKeywords: ['labeled', 'unlabeled', 'classification', 'clustering', 'prediction'] },
  { subject: 'ml', difficulty: 'medium', question: 'Explain overfitting and how to prevent it.', expectedKeywords: ['regularization', 'dropout', 'validation', 'generalize', 'training'] },
  { subject: 'ml', difficulty: 'medium', question: 'What is gradient descent?', expectedKeywords: ['minimize', 'loss', 'learning rate', 'slope', 'optimize'] },
  { subject: 'ml', difficulty: 'hard', question: 'Explain how a neural network works.', expectedKeywords: ['layers', 'weights', 'activation', 'backpropagation', 'neurons'] },
  { subject: 'ml', difficulty: 'medium', question: 'What is the difference between precision and recall?', expectedKeywords: ['true positive', 'false positive', 'false negative', 'F1', 'trade-off'] },

  // SQL
  { subject: 'sql', difficulty: 'easy', question: 'What is the difference between WHERE and HAVING clause?', expectedKeywords: ['group by', 'aggregate', 'filter', 'before', 'after'] },
  { subject: 'sql', difficulty: 'medium', question: 'Explain different types of JOINs in SQL.', expectedKeywords: ['inner', 'left', 'right', 'full outer', 'cross'] },
  { subject: 'sql', difficulty: 'medium', question: 'What are window functions in SQL?', expectedKeywords: ['ROW_NUMBER', 'RANK', 'OVER', 'partition', 'aggregate'] },
  { subject: 'sql', difficulty: 'hard', question: 'How do you optimize a slow SQL query?', expectedKeywords: ['index', 'explain', 'avoid SELECT *', 'join', 'execution plan'] },
  { subject: 'sql', difficulty: 'easy', question: 'What is a stored procedure?', expectedKeywords: ['precompiled', 'reusable', 'parameters', 'execute', 'performance'] },

  // Java
  { subject: 'java', difficulty: 'easy', question: 'What is the difference between JDK, JRE, and JVM?', expectedKeywords: ['compile', 'runtime', 'bytecode', 'platform', 'interpreter'] },
  { subject: 'java', difficulty: 'medium', question: 'Explain garbage collection in Java.', expectedKeywords: ['heap', 'unreachable', 'GC', 'memory', 'automatic'] },
  { subject: 'java', difficulty: 'medium', question: 'What is the difference between ArrayList and LinkedList?', expectedKeywords: ['index', 'O(1)', 'O(n)', 'insertion', 'memory'] },
  { subject: 'java', difficulty: 'hard', question: 'Explain multithreading in Java.', expectedKeywords: ['Thread', 'Runnable', 'synchronized', 'concurrent', 'deadlock'] },
  { subject: 'java', difficulty: 'medium', question: 'What are Java streams?', expectedKeywords: ['functional', 'filter', 'map', 'collect', 'lambda'] },

  // Python
  { subject: 'python', difficulty: 'easy', question: 'What are Python decorators?', expectedKeywords: ['wrapper', 'function', '@', 'modify', 'higher order'] },
  { subject: 'python', difficulty: 'medium', question: 'Explain the difference between list, tuple, set, and dictionary.', expectedKeywords: ['mutable', 'immutable', 'ordered', 'unique', 'key-value'] },
  { subject: 'python', difficulty: 'medium', question: 'What is a generator in Python?', expectedKeywords: ['yield', 'lazy', 'iterator', 'memory', 'next'] },
  { subject: 'python', difficulty: 'hard', question: 'Explain Python\'s GIL (Global Interpreter Lock).', expectedKeywords: ['thread', 'CPython', 'parallel', 'multiprocessing', 'lock'] },
  { subject: 'python', difficulty: 'easy', question: 'What is list comprehension in Python?', expectedKeywords: ['one line', 'for loop', 'filter', 'concise', 'iterable'] },

  // HR & Behavioral
  { subject: 'hr', difficulty: 'easy', question: 'Tell me about yourself.', expectedKeywords: ['background', 'experience', 'skills', 'goal', 'passionate'] },
  { subject: 'hr', difficulty: 'easy', question: 'What are your greatest strengths and weaknesses?', expectedKeywords: ['strength', 'improve', 'honest', 'working on', 'example'] },
  { subject: 'hr', difficulty: 'medium', question: 'Describe a time you handled a conflict in a team.', expectedKeywords: ['situation', 'action', 'result', 'communication', 'resolved'] },
  { subject: 'hr', difficulty: 'easy', question: 'Where do you see yourself in 5 years?', expectedKeywords: ['growth', 'role', 'contribute', 'learn', 'leadership'] },
  { subject: 'hr', difficulty: 'medium', question: 'Why do you want to work at our company?', expectedKeywords: ['research', 'values', 'mission', 'culture', 'opportunity'] },

  // Web Dev
  { subject: 'webdev', difficulty: 'easy', question: 'What is the difference between HTML, CSS, and JavaScript?', expectedKeywords: ['structure', 'style', 'behavior', 'markup', 'interactive'] },
  { subject: 'webdev', difficulty: 'medium', question: 'Explain how the browser renders a webpage.', expectedKeywords: ['DOM', 'CSSOM', 'render tree', 'paint', 'reflow'] },
  { subject: 'webdev', difficulty: 'medium', question: 'What is REST API and how does it work?', expectedKeywords: ['GET', 'POST', 'PUT', 'DELETE', 'stateless'] },
  { subject: 'webdev', difficulty: 'hard', question: 'What is the difference between cookies, localStorage, and sessionStorage?', expectedKeywords: ['expiry', 'server', 'persistent', 'session', 'size'] },
  { subject: 'webdev', difficulty: 'medium', question: 'Explain event bubbling and event delegation in JavaScript.', expectedKeywords: ['propagate', 'parent', 'child', 'stopPropagation', 'listener'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log(`✅ Seeded ${questions.length} questions`);
  process.exit();
}

seed();