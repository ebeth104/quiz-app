package com.app.quizapp.repository;

import com.app.quizapp.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT DISTINCT q.category FROM Question q")
    List<String> findDistinctCategory();

    Page<Question> findByCategory(String category, Pageable pageable);
}
