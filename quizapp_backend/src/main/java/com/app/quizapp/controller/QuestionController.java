package com.app.quizapp.controller;

import com.app.quizapp.model.Question;
import com.app.quizapp.service.IQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.CREATED;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuestionController {
    private final IQuestionService questionService;

    @PostMapping("/create-question")
    public ResponseEntity<Question> createQuestion(@Valid @RequestBody Question question)
    {
        Question newQuestion = questionService.createQuestion(question);
        return ResponseEntity.status(CREATED).body(newQuestion);
    }

    @GetMapping("/all-questions")
    public ResponseEntity<List<Question>> getAllQuestions()
    {
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/question/{id}")
    public ResponseEntity<Question> getQuestionbyid(@PathVariable Long id) throws ChangeSetPersister.NotFoundException {
        Optional<Question> the_question = questionService.getQuestionById(id);
        if (the_question.isPresent()) {
            return ResponseEntity.ok(the_question.get());
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @PutMapping("/question/{id}/update")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) throws ChangeSetPersister.NotFoundException {
        Question updatedQuestion = questionService.updateQuestion(id, question);
        return ResponseEntity.ok(updatedQuestion);
    }

    @DeleteMapping("/question/{id}/delete")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id)
    {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories()
    {
        List<String> categories = questionService.getCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/quiz/fetch-questions-for-user")
    public ResponseEntity<List<Question>> getQuestionsForUser(@RequestParam Integer numQ, @RequestParam String category)
    {
        List<Question> questions = questionService.getQuestionsForUser(numQ, category);
        List<Question> mutableQuestions = new ArrayList<>(questions);
        Collections.shuffle(mutableQuestions);

        int availableQuestions = Math.min(numQ, mutableQuestions.size());
        List<Question> randomQuestions = mutableQuestions.subList(0, availableQuestions);
        return ResponseEntity.ok(randomQuestions);
    }
}
