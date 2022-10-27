import 'mocha';
import * as fs from 'fs';
import path from 'path';
import { expect } from 'chai';

import Parser from '../src/parser';
import { DayPlannerSettings } from '../src/settings';
import type {PlanItem} from "../src/plan-data";

describe('parser', () => {
  it('should return parsed items', async () => {
    const fileContents = fs.readFileSync(path.join(__dirname, 'fixtures/test.md')).toString().split('\n');

    const settings = new DayPlannerSettings();
    settings.breakLabel = '☕️ COFFEE BREAK';
    settings.endLabel = '🛑 FINISH';

    const parser = new Parser(settings);

    const results = await parser.parseMarkdown(fileContents);

    expect(results.empty).to.be.false;
    expect(results.invalid).to.be.false;
    expect(results.items).to.have.lengthOf(13);

    const firstItem = results.items[0];
    expect(firstItem.isCompleted).to.be.true;
    expect(firstItem.isBreak).to.be.false;
    expect(firstItem.isEnd).to.be.false;
    expect(firstItem.rawStartTime).to.eql('08:00');
    expect(firstItem.text).to.eql('morning stuff');

    const fourthItem = results.items[3];
    expect(fourthItem.isCompleted).to.be.true;
    expect(fourthItem.isBreak).to.be.true;
    expect(fourthItem.isEnd).to.be.false;
    expect(fourthItem.rawStartTime).to.eql('11:00');
    expect(fourthItem.text).to.eql('☕️ COFFEE BREAK');

    const fifthItem = results.items[4];
    expect(fifthItem.isCompleted).to.be.false;
    expect(fifthItem.isBreak).to.be.false;
    expect(fifthItem.isEnd).to.be.false;
    expect(fifthItem.rawStartTime).to.eql('11:10');
    expect(fifthItem.rawEndTime).to.eql('');
    expect(fifthItem.text).to.eql('reading');

    const sixthItem = results.items[5];
    expect(sixthItem.isCompleted).to.be.false;
    expect(sixthItem.isBreak).to.be.false;
    expect(sixthItem.isEnd).to.be.false;
    expect(sixthItem.endTime).to.not.be.undefined;
    expect(sixthItem.rawStartTime).to.eql('11:20');
    expect(sixthItem.rawEndTime).to.eql('11:25');
    expect(sixthItem.text).to.eql('Short Jog');

    const seventhItem = results.items[6];
    expect(seventhItem.isCompleted).to.be.false;
    expect(seventhItem.isBreak).to.be.false;
    expect(seventhItem.isEnd).to.be.false;
    expect(seventhItem.endTime).to.not.be.undefined;
    expect(seventhItem.rawStartTime).to.eql('11:30');
    expect(seventhItem.rawEndTime).to.eql('11:40');
    expect(seventhItem.text).to.eql('Shower');

    const eigthItem = results.items[7];
    expect(eigthItem.isCompleted).to.be.false;
    expect(eigthItem.isBreak).to.be.false;
    expect(eigthItem.isEnd).to.be.false;
    expect(eigthItem.endTime).to.not.be.undefined;
    expect(eigthItem.rawStartTime).to.eql('11:45');
    expect(eigthItem.rawEndTime).to.eql('11:50');
    expect(eigthItem.text).to.eql('Relax');

    const ninethItem = results.items[8];
    expect(ninethItem.isCompleted).to.be.false;
    expect(ninethItem.isBreak).to.be.false;
    expect(ninethItem.isEnd).to.be.false;
    expect(ninethItem.endTime).to.not.be.undefined;
    expect(ninethItem.rawStartTime).to.eql('11:50');
    expect(ninethItem.rawEndTime).to.eql('11:59');
    expect(ninethItem.text).to.eql('check email');

    const tenthItem = results.items[10];
    expect(tenthItem.isCompleted).to.be.false;
    expect(tenthItem.isBreak).to.be.true;
    expect(tenthItem.isEnd).to.be.false;
    expect(tenthItem.rawStartTime).to.eql('13:00');
    expect(tenthItem.text).to.eql('☕️ COFFEE BREAK');

    const twelthItem = results.items[12];
    expect(twelthItem.isCompleted).to.be.false;
    expect(twelthItem.isBreak).to.be.false;
    expect(twelthItem.isEnd).to.be.true;
    expect(twelthItem.rawStartTime).to.eql('14:00');
    expect(twelthItem.text).to.eql('🛑 FINISH');
  });

  it('should return parsed items sorted by time', async () => {
    const orderedFileContents = fs.readFileSync(path.join(__dirname, 'fixtures/test.md')).toString().split('\n');
    const unOrderedFileContents = fs.readFileSync(path.join(__dirname, 'fixtures/unordered_test.md')).toString().split('\n');

    const settings = new DayPlannerSettings();
    settings.breakLabel = '☕️ COFFEE BREAK';
    settings.endLabel = '🛑 FINISH';

    const parser = new Parser(settings);
    let orderedResults = await parser.parseMarkdown(orderedFileContents);
    let unOrderedResults = await parser.parseMarkdown(unOrderedFileContents);

    // Remove fields that won't match
    function removeKeys (item: PlanItem) {
      delete item['matchIndex'];
      delete item['time'];
      return item;
    }

    orderedResults.items = orderedResults.items.map(removeKeys);
    unOrderedResults.items = unOrderedResults.items.map(removeKeys);
    expect(orderedResults).to.eql(unOrderedResults);
  });
});