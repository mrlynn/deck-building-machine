import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildFlashcards,
  quizScore,
  REHEARSE_QUIZ,
  REHEARSE_TOUR,
} from './rehearse';

describe('buildFlashcards', () => {
  it('resolves slug into brand rule path', () => {
    const cards = buildFlashcards('acme');
    assert.ok(cards.length >= 6);
    assert.ok(
      cards.some((c) => c.path === '.cursor/rules/acme-brand.mdc'),
    );
  });

  it('keeps demo tips as answers', () => {
    const cards = buildFlashcards('acme');
    for (const card of cards) {
      assert.ok(card.answer.length > 10);
      assert.ok(card.prompt.includes('say'));
    }
  });
});

describe('quizScore', () => {
  it('marks ready only when all answers are correct', () => {
    const perfect: Record<string, string> = {};
    for (const q of REHEARSE_QUIZ) {
      perfect[q.id] = q.correctOptionId;
    }
    assert.deepEqual(quizScore(perfect), {
      correct: REHEARSE_QUIZ.length,
      total: REHEARSE_QUIZ.length,
      ready: true,
    });
    assert.equal(quizScore({}).ready, false);
  });
});

describe('REHEARSE_TOUR', () => {
  it('covers Rules, Skills, and Agents', () => {
    const primitives = new Set(REHEARSE_TOUR.map((b) => b.primitive));
    assert.ok(primitives.has('Rules'));
    assert.ok(primitives.has('Skills'));
    assert.ok(primitives.has('Agents'));
  });
});
