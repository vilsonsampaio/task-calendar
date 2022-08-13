import {
  Grid,
  ModalBody,
  ModalFooter,
  ModalProps,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '../Button';
import Input from '../Input';
import Textarea from '../Textarea';
import Modal from './Modal';

type AddTaskModalProps = Omit<ModalProps, 'children'>;

interface AddTaskFormik {
  title: string;
  description: string;
  date: string;
  duration: string;
}

function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const addTaskFormik = useFormik<AddTaskFormik>({
    initialValues: {
      title: '',
      description: '',
      date: '',
      duration: '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('O campo é obrigatório'),
      description: Yup.string(),
      date: Yup.date()
        .required('O campo é obrigatório')
        .typeError('Selecione uma data'),
      duration: Yup.string()
        .matches(/^\d\d:\d\d$/gm, 'Formato inválido!')
        .required('O campo é obrigatório'),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar tarefa">
      <form onSubmit={addTaskFormik.handleSubmit}>
        <ModalBody pb={6}>
          <VStack gap={2}>
            <Input
              label="Título"
              name="title"
              placeholder="Título da tarefa"
              value={addTaskFormik.values.title}
              onChange={addTaskFormik.handleChange}
              error={addTaskFormik.errors.title}
            />

            <Textarea
              label="Descrição"
              name="description"
              placeholder="Escreva aqui uma descrição pra tarefa"
              value={addTaskFormik.values.description}
              onChange={addTaskFormik.handleChange}
              error={addTaskFormik.errors.description}
            />

            <Grid templateColumns="1fr 1fr" gap={4}>
              <Input
                type="datetime-local"
                label="Data e Hora"
                name="date"
                onChange={addTaskFormik.handleChange}
                error={addTaskFormik.errors.date}
              />

              <Input
                label="Duração"
                name="duration"
                placeholder="hh:mm"
                value={addTaskFormik.values.duration}
                onChange={addTaskFormik.handleChange}
                error={addTaskFormik.errors.duration}
              />
            </Grid>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button type="submit" variant="solid">
            Adicionar
          </Button>

          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export default AddTaskModal;
