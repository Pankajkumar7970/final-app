import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LessonViewer } from "../../../components/LessonViewer";
// import type { Lesson, Course } from "../../../types/lesson"; // Adjust the import path as needed
import { router, useLocalSearchParams } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import API from "../../../api/api";
import Loader from "../../../components/Loader";
import TranslatedText from "../../../components/TranslatedText";

const fetchCourse = async (courseId) => {
  console.log("Fetching course with ID:", courseId);
  const res = await API.get(`/courses/${courseId}`);
  return res.data;
};

export default function Lesson() {
  // const [courses, setCourses] = useState([]);
  const { lessonId, courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    async function course() {
      setLoading(true);
      const course = await fetchCourse(courseId).then((res) => res.course);
      // console.log("Fetched course:", course);
      setCourse(course);
      const progressData = await API.get(
        `/progress?type=course&courseId=${courseId}`
      ).then((res) => res.data);
      if (progressData.progress.length === 0) {
        setCurrentLessonIndex(0);
      } else {
        setCurrentLessonIndex(
          progressData.progress[0]?.lessonIndex + 1 === course.lessons.length
            ? 0
            : progressData.progress[0]?.lessonIndex + 1
        );
      }
      // setLesson(course.lessons[0]);
      progressData.progress.length !== 0
        ? setLesson(
            course.lessons[
              progressData.progress[0].lessonIndex === course.lessons.length - 1
                ? 0
                : progressData.progress[0].lessonIndex + 1
            ]
          )
        : setLesson(course.lessons[0]);
      setLoading(false);
    }
    course();
  }, [courseId]);
  // console.log("Lesssssssson", lesson);
  // console.log("Course", course);

  const handleLessonComplete = async () => {
    const nextLessonIndex =
      course.lessons.findIndex((l) => l._id === lesson._id) + 1;

    if (nextLessonIndex < course.lessons.length) {
      setLesson(course.lessons[nextLessonIndex]);
    } else if (nextLessonIndex === course.lessons.length) {
      // If there are no more lessons, you can navigate back or show a completion message
      router.back();
    }
    const response = await API.post(`/courses/${courseId}/complete`, {
      lessonId: lesson._id,
      status:
        nextLessonIndex < course.lessons.length ? "in_progress" : "completed",
    });
    const Exp = response.data.points;
    if (nextLessonIndex === course.lessons.length) {
      Alert.alert(
        "Exp Earned!",
        `Congratulations!!! You have earned ${Exp} Exp points.`,
        [{ text: "OK" }]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
      >
        <Loader />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {lesson && (
        <LessonViewer
          lesson={lesson}
          onBack={() => goBack()}
          onComplete={handleLessonComplete}
          totalLessons={course?.lessons?.length || 0}
          currentLessonIndex={currentLessonIndex}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
