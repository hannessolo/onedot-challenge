import Dictionary from '../../app/business/dictionary.js';
import issues from '../../app/business/issue.js';

test('can put into dictionary', () => {
  let dict = new Dictionary();
  let key = 'Stonegray';
  let value = 'Dark Gray';
  let id = 0;

  dict.put(key, value, id);

  expect(dict.get(id).key).toBe(key);
  expect(dict.get(id).value).toBe(value);
});

test('no issues by default', () => {
  let dict = new Dictionary();
  let key = 'Stonegray';
  let value = 'Dark Gray';
  let id = 0;

  dict.put(key, value, id);

  expect(dict.get(id).issues.length).toBe(0);
});

test('can detect duplicates', () => {
  let dict = new Dictionary();
  let key = 'Stonegray';
  let value = 'Dark Gray';
  let ids = [0, 1];

  for (let id in ids) {
    dict.put(key, value, id);
  }

  for (let id in ids) {
    expect(dict.get(id).issues[0].type).toBe(issues.DUPLICATE);
  }

});

test('can detect forks', () => {
  let dict = new Dictionary();
  let key = 'Stonegray';
  let values = ['Dark Gray', 'Anthracite'];
  let ids = [0, 1];

  for (let id in ids) {
    dict.put(key, values[id], id);
  }

  for (let id in ids) {
    expect(dict.get(id).issues[0].type).toBe(issues.FORK);
  }
});

test('can detect chains', () => {
  let dict = new Dictionary();
  let shared = 'Dark Gray';
  let key = 'Stonegray';
  let value = 'Anthracite';

  dict.put(key, shared, 0);
  dict.put(shared, value, 1);

  expect(dict.get(0).issues[0].type).toBe(issues.CHAIN);
  expect(dict.get(1).issues[0].type).toBe(issues.CHAIN);

});

test('can detect long chains', () => {
  let dict = new Dictionary();
  for (let i = 0; i < 10; i++) {
    dict.put(i, i + 1, i);
  }

  for (let i = 0; i < 10; i++) {
    expect(dict.get(i).issues[0].type).toBe(issues.CHAIN);
  }
});

test('can detect chains in any order', () => {
  let dict = new Dictionary();
  let shared = 'Dark Gray';
  let key = 'Stonegray';
  let value = 'Anthracite';

  // Switch the order of addition
  dict.put(shared, value, 1);
  dict.put(key, shared, 0);

  expect(dict.get(0).issues[0].type).toBe(issues.CHAIN);
  expect(dict.get(1).issues[0].type).toBe(issues.CHAIN);
});

test('can detect cycles', () => {
  let dict = new Dictionary();

  let first = 'first';
  let second = 'second';

  dict.put(first, second, 0);
  dict.put(second, first, 1);

  expect(dict.get(0).issues[0].type).toBe(issues.CYCLE);
  expect(dict.get(1).issues[0].type).toBe(issues.CYCLE);
});

test('can detect long cycles', () => {
  let dict = new Dictionary();

  for (let i = 0; i < 4; i++) {
    dict.put(i, i + 1, i);
  }
  dict.put(4, 0, 4);

  for (let i = 0; i <= 4; i++) {
    expect(dict.get(i).issues[0].type).toBe(issues.CYCLE);
  }
});

test('can remove from dictionary', () => {
  let dict = new Dictionary();
  let key = 'Stonegray';
  let value = 'Dark Gray';
  let id = 0;

  dict.put(key, value, id);
  dict.remove(id);

  expect(dict.get(id)).toBeUndefined();
});

test('removing offending pair removes issue for forks', () => {
  let dict = new Dictionary();
  let key = 'Stonegray';
  let values = ['Dark Gray', 'Anthracite'];
  let ids = [0, 1];

  for (let id in ids) {
    dict.put(key, values[id], id);
  }

  debugger;
  dict.remove(0);
  expect(dict.get(1).issues.length).toBe(0);
});
